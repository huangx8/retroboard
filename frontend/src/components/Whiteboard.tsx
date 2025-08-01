import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Stage, Layer } from 'react-konva'
import { io, Socket } from 'socket.io-client'
import { v4 as uuidv4 } from 'uuid'
import Toolbar from './Toolbar'
import DrawableShape from './DrawableShape'
import UserCursors from './UserCursors'
import UserProfile from './UserProfile'
import OnlineUsersList from './OnlineUsersList'
import { getUserSession } from '../utils/userSession'
import type { User as SessionUser } from '../utils/userSession'
import './Whiteboard.css'

interface WhiteboardObject {
  id: string
  type: 'rectangle' | 'circle' | 'line' | 'image' | 'video'
  x: number
  y: number
  width?: number
  height?: number
  fill?: string
  stroke?: string
  strokeWidth?: number
  text?: string
  fontSize?: number
  src?: string
  videoUrl?: string
  points?: number[]
  createdBy?: string
  createdAt?: Date
}

interface User {
  id: string
  name: string
  color: string
  socketId?: string
}

interface CursorPosition {
  userId: string
  userName: string
  position: { x: number; y: number }
  color: string
}

const Whiteboard = () => {
  const { boardId } = useParams<{ boardId: string }>()
  const navigate = useNavigate()
  const [objects, setObjects] = useState<WhiteboardObject[]>([])
  const [selectedTool, setSelectedTool] = useState<string>('select')
  const [selectedObject, setSelectedObject] = useState<string | null>(null)
  const [socket, setSocket] = useState<Socket | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [boardName, setBoardName] = useState<string>('')
  const [cursors, setCursors] = useState<CursorPosition[]>([])
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentPath, setCurrentPath] = useState<number[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; visible: boolean; objectId: string | null }>({
    x: 0,
    y: 0,
    visible: false,
    objectId: null
  })
  const stageRef = useRef<any>(null)

  // Initialize user and socket connection
  useEffect(() => {
    if (!boardId) return

    // Fetch board information first
    const fetchBoardInfo = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_SERVER_URL || 'http://localhost:3000'}/api/boards/${boardId}`)
        if (response.ok) {
          const board = await response.json()
          setBoardName(board.name || `Board ${boardId?.slice(0, 8)}`)
          setObjects(board.objects || [])
        }
      } catch (error) {
        console.error('Failed to fetch board info:', error)
        setBoardName(`Board ${boardId?.slice(0, 8)}`)
      }
    }

    fetchBoardInfo()

    // Get or create persistent user session
    const currentUser = getUserSession()
    setUser(currentUser)

    // Initialize socket connection
    const newSocket = io(import.meta.env.VITE_SERVER_URL || 'http://localhost:3000', {
      // Increase timeout for large image uploads
      timeout: 60000,
      // Enable reconnection
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    })
    setSocket(newSocket)

    // Handle socket errors
    newSocket.on('connect', () => {
      console.log('Socket connected:', newSocket.id)
      setIsConnected(true)

      // Add current user to the cursors list immediately to ensure they're in the users list
      // This ensures the current user is included even if they haven't moved their cursor
      setCursors(prev => {
        const existingUser = prev.find(c => c.userId === currentUser.id)
        if (!existingUser) {
          return [...prev, {
            userId: currentUser.id,
            userName: currentUser.name,
            position: { x: 0, y: 0 }, // Default position until they move
            color: currentUser.color
          }]
        }
        return prev
      })
    })

    newSocket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason)
      setIsConnected(false)
    })

    newSocket.on('error', (error) => {
      console.error('Socket error:', error)
      setIsConnected(false)
      alert('Connection error occurred. Please try again.')
    })

    // Join board room
    newSocket.emit('join-board', {
      boardId,
      user: currentUser
    })

    // Listen for board state
    newSocket.on('board-state', (boardData) => {
      setObjects(boardData.objects || [])
    })

    // Listen for active users list from server
    newSocket.on('active-users', (data) => {
      setCursors(data.users)
    })

    // Listen for new users joining
    newSocket.on('user-joined', (data) => {
      const newUser = data.user
      setCursors(prev => {
        const existingUser = prev.find(c => c.userId === newUser.id)
        if (!existingUser) {
          return [...prev, {
            userId: newUser.id,
            userName: newUser.name,
            position: { x: 0, y: 0 }, // Default position until they move
            color: newUser.color
          }]
        }
        return prev
      })
    })

    // Listen for users leaving
    newSocket.on('user-left', (data) => {
      const departedUser = data.user
      setCursors(prev => prev.filter(c => c.userId !== departedUser.id))
    })

    // Listen for real-time updates
    newSocket.on('object-added', (data) => {
      setObjects(prev => [...prev, data.object])
    })

    newSocket.on('object-updated', (data) => {
      setObjects(prev => prev.map(obj => 
        obj.id === data.objectId ? { ...obj, ...data.updates } : obj
      ))
    })

    newSocket.on('object-deleted', (data) => {
      setObjects(prev => prev.filter(obj => obj.id !== data.objectId))
    })

    newSocket.on('board-cleared', () => {
      setObjects([])
    })

    // Listen for cursor movements
    newSocket.on('cursor-moved', (data) => {
      setCursors(prev => {
        const existing = prev.find(c => c.userId === data.userId)
        if (existing) {
          return prev.map(c => 
            c.userId === data.userId 
              ? { ...c, position: data.position }
              : c
          )
        } else {
          return [...prev, {
            userId: data.userId,
            userName: data.userName,
            position: data.position,
            color: data.color
          }]
        }
      })
    })

    // Listen for user profile updates
    newSocket.on('user-updated', (data) => {
      // Update cursor names when users change their names
      setCursors(prev => prev.map(cursor => 
        cursor.userId === data.user.id 
          ? { ...cursor, userName: data.user.name }
          : cursor
      ))
    })

    // Listen for object layer changes
    newSocket.on('object-sent-to-back', (data) => {
      setObjects(prev => {
        const objectToMove = prev.find(obj => obj.id === data.objectId)
        if (!objectToMove) return prev

        const otherObjects = prev.filter(obj => obj.id !== data.objectId)
        return [objectToMove, ...otherObjects]
      })
    })

    return () => {
      newSocket.disconnect()
    }
  }, [boardId])

  // Cursor style effect
  useEffect(() => {
    const canvasContainer = document.querySelector('.canvas-container') as HTMLElement
    if (canvasContainer) {
      if (selectedTool === 'select') {
        canvasContainer.className = 'canvas-container select-mode'
      } else {
        canvasContainer.className = 'canvas-container draw-mode'
      }
    }
    return () => {
      if (canvasContainer) {
        canvasContainer.className = 'canvas-container'
      }
    }
  }, [selectedTool])

  const handleImageUpload = (position: { x: number; y: number }) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        // Check file size (limit to 5MB)
        if (file.size > 5 * 1024 * 1024) {
          alert('Image file is too large. Please choose an image smaller than 5MB.')
          return
        }

        const reader = new FileReader()
        reader.onerror = () => {
          alert('Error reading image file.')
        }
        reader.onload = (e) => {
          const imageSrc = e.target?.result as string
          if (imageSrc) {
            // Create image object to get dimensions
            const img = new Image()
            img.onerror = () => {
              alert('Error loading image.')
            }
            img.onload = () => {
              const maxWidth = 300
              const maxHeight = 300
              let width = img.width
              let height = img.height

              // Scale down if too large
              if (width > maxWidth || height > maxHeight) {
                const ratio = Math.min(maxWidth / width, maxHeight / height)
                width *= ratio
                height *= ratio
              }

              // Create canvas to compress image if needed
              const canvas = document.createElement('canvas')
              const ctx = canvas.getContext('2d')
              canvas.width = width
              canvas.height = height
              
              if (ctx) {
                ctx.drawImage(img, 0, 0, width, height)
                // Compress to JPEG with 80% quality to reduce file size
                const compressedSrc = canvas.toDataURL('image/jpeg', 0.8)
                
                console.log(`Image compressed: ${Math.round(imageSrc.length / 1024)}KB -> ${Math.round(compressedSrc.length / 1024)}KB`)

                const newImageObject: WhiteboardObject = {
                  id: uuidv4(),
                  type: 'image',
                  x: position.x - width / 2,
                  y: position.y - height / 2,
                  width,
                  height,
                  src: compressedSrc,
                  createdBy: user?.id
                }

                console.log('Creating image object:', newImageObject)

                if (socket && socket.connected) {
                  console.log('Emitting image object to server...')
                  socket.emit('object-add', { object: newImageObject })
                } else {
                  console.error('Socket not connected, current state:', socket?.connected)
                  alert('Connection lost. Please refresh the page and try again.')
                }
              }
            }
            img.src = imageSrc
          }
        }
        reader.readAsDataURL(file)
      }
    }
    input.click()
  }

  const handleVideoEmbed = (position: { x: number; y: number }) => {
    const videoUrl = prompt('Enter video URL (YouTube, Vimeo, etc.):')
    if (videoUrl) {
      // Convert various video URLs to embeddable format
      let embedUrl = videoUrl
      
      // YouTube URL conversion
      const youtubeMatch = videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
      if (youtubeMatch) {
        embedUrl = `https://www.youtube.com/embed/${youtubeMatch[1]}`
      }
      
      // Vimeo URL conversion
      const vimeoMatch = videoUrl.match(/vimeo\.com\/(\d+)/)
      if (vimeoMatch) {
        embedUrl = `https://player.vimeo.com/video/${vimeoMatch[1]}`
      }

      const newVideoObject: WhiteboardObject = {
        id: uuidv4(),
        type: 'video',
        x: position.x - 200,
        y: position.y - 150,
        width: 400,
        height: 300,
        videoUrl: embedUrl,
        createdBy: user?.id
      }

      if (socket) {
        socket.emit('object-add', { object: newVideoObject })
      }
    }
  }

  const handleStageMouseDown = (e: any) => {
    if (selectedTool === 'select') return

    const stage = e.target.getStage()
    const pointerPosition = stage.getPointerPosition()
    
    // Adjust pointer position for zoom scale
    const adjustedPosition = {
      x: pointerPosition.x / zoom,
      y: pointerPosition.y / zoom
    }

    if (selectedTool === 'pen') {
      setIsDrawing(true)
      setCurrentPath([adjustedPosition.x, adjustedPosition.y])
    } else if (selectedTool === 'image') {
      handleImageUpload(adjustedPosition)
    } else if (selectedTool === 'video') {
      handleVideoEmbed(adjustedPosition)
    } else {
      // Create new shape
      const shapeWidth = 100
      const shapeHeight = 100
      
      // For circles, center them at the cursor position
      // For rectangles, use cursor position as top-left corner
      const shapeX = selectedTool === 'circle' 
        ? adjustedPosition.x - shapeWidth / 2
        : adjustedPosition.x
      const shapeY = selectedTool === 'circle'
        ? adjustedPosition.y - shapeHeight / 2
        : adjustedPosition.y

      const newObject: WhiteboardObject = {
        id: uuidv4(),
        type: selectedTool as WhiteboardObject['type'],
        x: shapeX,
        y: shapeY,
        width: shapeWidth,
        height: shapeHeight,
        // Let server apply user's profile color
        strokeWidth: 2,
        createdBy: user?.id
      }

      // Only emit to server - don't add locally
      // The server will broadcast back and we'll add it via the 'object-added' listener
      if (socket) {
        socket.emit('object-add', { object: newObject })
      }
    }
  }

  const handleStageMouseMove = (e: any) => {
    const stage = e.target.getStage()
    const pointerPosition = stage.getPointerPosition()

    // Emit cursor position (use original position for cursors)
    if (socket && user) {
      socket.emit('cursor-move', { position: pointerPosition })
    }

    if (isDrawing && selectedTool === 'pen') {
      // Adjust for zoom when drawing
      const adjustedPosition = {
        x: pointerPosition.x / zoom,
        y: pointerPosition.y / zoom
      }
      setCurrentPath(prev => [...prev, adjustedPosition.x, adjustedPosition.y])
    }
  }

  const handleStageMouseUp = () => {
    if (isDrawing && selectedTool === 'pen' && currentPath.length > 0) {
      const newLine: WhiteboardObject = {
        id: uuidv4(),
        type: 'line',
        x: 0,
        y: 0,
        points: currentPath,
        // Let server apply user's profile color
        strokeWidth: 3,
        createdBy: user?.id
      }

      // Only emit to server - don't add locally
      // The server will broadcast back and we'll add it via the 'object-added' listener
      if (socket) {
        socket.emit('object-add', { object: newLine })
      }

      setCurrentPath([])
    }
    setIsDrawing(false)
  }

  const handleObjectUpdate = (objectId: string, updates: Partial<WhiteboardObject>) => {
    setObjects(prev => prev.map(obj => 
      obj.id === objectId ? { ...obj, ...updates } : obj
    ))

    if (socket) {
      socket.emit('object-update', { objectId, updates })
    }
  }

  const handleObjectDelete = (objectId: string) => {
    // Only emit to server - don't delete locally
    // The server will broadcast back and we'll remove it via the 'object-deleted' listener
    if (socket) {
      socket.emit('object-delete', { objectId })
    }
  }

  const handleSendToBack = (objectId: string) => {
    // Move the object to the beginning of the array (back layer)
    setObjects(prev => {
      const objectToMove = prev.find(obj => obj.id === objectId)
      if (!objectToMove) return prev

      const otherObjects = prev.filter(obj => obj.id !== objectId)
      return [objectToMove, ...otherObjects]
    })

    // Emit the layer change to other users
    if (socket) {
      socket.emit('object-send-to-back', { objectId })
    }
    
    // Close context menu
    setContextMenu({ x: 0, y: 0, visible: false, objectId: null })
  }

  // Close context menu when clicking elsewhere
  useEffect(() => {
    const handleClickOutside = () => {
      if (contextMenu.visible) {
        setContextMenu({ x: 0, y: 0, visible: false, objectId: null })
      }
    }

    if (contextMenu.visible) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [contextMenu.visible])

  const handleUserUpdate = (updatedUser: SessionUser) => {
    setUser(updatedUser)
    // Notify other users of the name change via socket
    if (socket) {
      socket.emit('user-update', { user: updatedUser })
    }
  }

  const handleClearAll = () => {
    if (socket) {
      socket.emit('clear-board')
    }
  }

  const handleExport = async () => {
    if (!stageRef.current) return

    try {
      const stage = stageRef.current
      const hasVideos = objects.some(obj => obj.type === 'video')
      
      if (hasVideos) {
        // Show options when videos are present
        const choice = window.confirm(
          'This board contains videos. Click OK to export everything (including videos) or Cancel to export only shapes and images.'
        )
        
        if (choice) {
          // Try to export with html2canvas (includes videos)
          try {
            const html2canvas = (await import('html2canvas')).default
            const canvasContainer = document.querySelector('.canvas-container') as HTMLElement
            
            if (canvasContainer) {
              const canvas = await html2canvas(canvasContainer, {
                useCORS: true,
                allowTaint: true,
                width: canvasContainer.offsetWidth,
                height: canvasContainer.offsetHeight,
                background: '#ffffff'
              })
              
              const fullDataURL = canvas.toDataURL('image/png')
              downloadImage(fullDataURL, 'full')
              return
            }
          } catch (error) {
            console.error('Full export failed, falling back to canvas only:', error)
            alert('Full export failed. Exporting canvas only (without videos).')
          }
        }
      }
      
      // Export canvas only (shapes, lines, images - no videos)
      const dataURL = stage.toDataURL({
        pixelRatio: 2,
        mimeType: 'image/png',
        quality: 1
      })
      
      downloadImage(dataURL, 'canvas')
      
    } catch (error) {
      console.error('Export failed:', error)
      alert('Failed to export board. Please try again.')
    }
  }

  const downloadImage = (dataURL: string, type: 'full' | 'canvas') => {
    const link = document.createElement('a')
    const timestamp = new Date().toISOString().slice(0, 10)
    const suffix = type === 'full' ? 'complete' : 'canvas'
    link.download = `${boardName || `Board-${boardId?.slice(0, 8)}`}-${suffix}-${timestamp}.png`
    link.href = dataURL
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    console.log(`Board exported successfully (${type})`)
  }

  const goBackToBoards = () => {
    navigate('/')
  }

  // Handle wheel zoom
  const handleWheel = (e: any) => {
    e.evt.preventDefault()
    const scaleBy = 1.1
    const oldScale = zoom
    let newScale: number
    if (e.evt.deltaY < 0) {
      newScale = Math.min(oldScale * scaleBy, 4)
    } else {
      newScale = Math.max(oldScale / scaleBy, 0.2)
    }
    setZoom(newScale)
  }

  // Toolbar zoom controls
  const handleZoomIn = () => setZoom(z => Math.min(z * 1.1, 4))
  const handleZoomOut = () => setZoom(z => Math.max(z / 1.1, 0.2))
  const handleZoomReset = () => setZoom(1)

  return (
    <div className="whiteboard">
      <div className="whiteboard-header">
        <button onClick={goBackToBoards} className="back-btn">
          ← Back to Boards
        </button>
        <h2>{boardName || `Board ${boardId?.slice(0, 8)}`}</h2>
        <UserProfile user={user} onUserUpdate={handleUserUpdate} isConnected={isConnected} />
      </div>

      <Toolbar 
        selectedTool={selectedTool}
        onToolSelect={setSelectedTool}
        onClearAll={handleClearAll}
        onExport={handleExport}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onZoomReset={handleZoomReset}
      />

      <div className="canvas-container">
        <Stage
          ref={stageRef}
          width={window.innerWidth}
          height={window.innerHeight - 120}
          scaleX={zoom}
          scaleY={zoom}
          onWheel={handleWheel}
          onMouseDown={handleStageMouseDown}
          onMouseMove={handleStageMouseMove}
          onMouseUp={handleStageMouseUp}
          onContextMenu={(e) => {
            // Prevent default context menu on empty canvas area
            e.evt.preventDefault()
          }}
        >
          <Layer>
            {objects.map((obj) => (
              <DrawableShape
                key={obj.id}
                object={obj}
                isSelected={selectedObject === obj.id}
                onSelect={setSelectedObject}
                onUpdate={handleObjectUpdate}
                onDelete={handleObjectDelete}
                onSendToBack={handleSendToBack}
              />
            ))}
            
            {/* Current drawing line */}
            {isDrawing && currentPath.length > 0 && (
              <DrawableShape
                object={{
                  id: 'temp',
                  type: 'line',
                  x: 0,
                  y: 0,
                  points: currentPath,
                  stroke: user?.color || '#333',
                  strokeWidth: 3
                }}
                isSelected={false}
                onSelect={() => {}}
                onUpdate={() => {}}
                onDelete={() => {}}
              />
            )}
          </Layer>
        </Stage>

        <UserCursors cursors={cursors} />
        
        {/* Online Users List */}
        <OnlineUsersList
          users={cursors.map(cursor => ({
            userId: cursor.userId,
            userName: cursor.userName,
            color: cursor.color
          }))}
          currentUserId={user?.id || ''}
        />

        {/* Video overlays */}
        {objects
          .filter(obj => obj.type === 'video' && obj.videoUrl)
          .map((videoObj) => (
            <div
              key={videoObj.id}
              style={{
                position: 'absolute',
                left: videoObj.x * zoom,
                top: videoObj.y * zoom,
                width: (videoObj.width || 400) * zoom,
                height: (videoObj.height || 300) * zoom,
                pointerEvents: selectedObject === videoObj.id ? 'none' : 'auto',
                border: selectedObject === videoObj.id ? '2px solid #007bff' : '2px solid transparent',
                borderRadius: '4px',
                zIndex: 10,
                cursor: 'pointer',
                transformOrigin: 'top left'
              }}
              onClick={(e) => {
                e.stopPropagation()
                setSelectedObject(videoObj.id)
              }}
              onDoubleClick={(e) => {
                e.stopPropagation()
                const newVideoUrl = prompt('Enter video URL (YouTube, Vimeo, etc.):', videoObj.videoUrl || '')
                if (newVideoUrl !== null && newVideoUrl.trim() !== '') {
                  // Convert various video URLs to embeddable format
                  let embedUrl = newVideoUrl
                  
                  // YouTube URL conversion
                  const youtubeMatch = newVideoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
                  if (youtubeMatch) {
                    embedUrl = `https://www.youtube.com/embed/${youtubeMatch[1]}`
                  }
                  
                  // Vimeo URL conversion
                  const vimeoMatch = newVideoUrl.match(/vimeo\.com\/(\d+)/)
                  if (vimeoMatch) {
                    embedUrl = `https://player.vimeo.com/video/${vimeoMatch[1]}`
                  }

                  handleObjectUpdate(videoObj.id, { videoUrl: embedUrl })
                }
              }}
            >
              <iframe
                src={videoObj.videoUrl}
                width="100%"
                height="100%"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ 
                  pointerEvents: 'auto',
                  borderRadius: '2px'
                }}
              />
            </div>
          ))
        }

        {/* Context Menu */}
        {contextMenu.visible && (
          <div
            style={{
              position: 'fixed',
              left: contextMenu.x,
              top: contextMenu.y,
              zIndex: 1000,
              background: 'white',
              border: '1px solid #ccc',
              borderRadius: '4px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              padding: '4px 0',
              minWidth: '120px'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => contextMenu.objectId && handleSendToBack(contextMenu.objectId)}
              style={{
                width: '100%',
                padding: '8px 16px',
                border: 'none',
                background: 'transparent',
                textAlign: 'left',
                cursor: 'pointer',
                fontSize: '14px'
              }}
              onMouseEnter={(e) => (e.target as HTMLElement).style.background = '#f0f0f0'}
              onMouseLeave={(e) => (e.target as HTMLElement).style.background = 'transparent'}
            >
              📤 Send to Back
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Whiteboard
