import { useRef, useEffect, useCallback, useState } from 'react'
import { Rect, Circle, Line, Text, Transformer, Image as KonvaImage } from 'react-konva'
import Konva from 'konva'

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

interface DrawableShapeProps {
  object: WhiteboardObject
  isSelected: boolean
  onSelect: (id: string | null) => void
  onUpdate: (id: string, updates: Partial<WhiteboardObject>) => void
  onDelete: (id: string) => void
}

const DrawableShape = ({
  object,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
}: DrawableShapeProps) => {
  const shapeRef = useRef<any>(null)
  const transformerRef = useRef<any>(null)
  const [imageElement, setImageElement] = useState<HTMLImageElement | null>(null)

  // Load image for Konva rendering
  useEffect(() => {
    if (object.type === 'image' && object.src) {
      console.log('Loading image:', object.src.substring(0, 50) + '...')
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onerror = (error) => {
        console.error('Failed to load image:', error)
        setImageElement(null)
      }
      img.onload = () => {
        console.log('Image loaded successfully:', img.width, 'x', img.height)
        setImageElement(img)
      }
      img.src = object.src
    }
  }, [object.src, object.type])

  useEffect(() => {
    if (isSelected && transformerRef.current && shapeRef.current) {
      transformerRef.current.nodes([shapeRef.current])
      transformerRef.current.getLayer()?.batchDraw()
    }
  }, [isSelected])

  const handleSelect = (e: Konva.KonvaEventObject<MouseEvent>) => {
    e.cancelBubble = true
    onSelect(object.id)
  }

  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    const node = e.target

    if (object.type === 'circle') {
      // For circles, convert center position back to top-left corner
      onUpdate(object.id, {
        x: node.x() - (object.width || 100) / 2,
        y: node.y() - (object.height || 100) / 2
      })
    } else {
      // For other shapes, use the position directly
      onUpdate(object.id, {
        x: node.x(),
        y: node.y()
      })
    }
  }

  const handleTransformEnd = (e: Konva.KonvaEventObject<Event>) => {
    const node = e.target
    const scaleX = node.scaleX()
    const scaleY = node.scaleY()

    // Reset scale and update dimensions
    node.scaleX(1)
    node.scaleY(1)

    onUpdate(object.id, {
      x: node.x(),
      y: node.y(),
      width: Math.max(5, node.width() * scaleX),
      height: Math.max(5, node.height() * scaleY)
    })
  }

  const handleDoubleClick = () => {
    // Allow text editing for rectangles and video URL editing for videos
    if (object.type === 'rectangle') {
      const newText = prompt('Enter text for this rectangle:', object.text || '')
      if (newText !== null) {
        onUpdate(object.id, { text: newText })
      }
    } else if (object.type === 'video') {
      const newVideoUrl = prompt('Enter video URL (YouTube, Vimeo, etc.):', object.videoUrl || '')
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

        onUpdate(object.id, { videoUrl: embedUrl })
      }
    }
  }

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Delete' || e.key === 'Backspace') {
      if (isSelected) {
        e.preventDefault()
        onDelete(object.id)
      }
    }
  }, [isSelected, onDelete, object.id])

  useEffect(() => {
    if (isSelected) {
      window.addEventListener('keydown', handleKeyDown)
      return () => window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isSelected, handleKeyDown])

  const renderShape = () => {
    const commonProps = {
      ref: shapeRef,
      draggable: true,
      onClick: handleSelect,
      onTap: handleSelect,
      onDragEnd: handleDragEnd,
      onTransformEnd: handleTransformEnd,
      onDblClick: handleDoubleClick,
      onDblTap: handleDoubleClick
      // Removed onContextMenu: handleRightClick
    }

    switch (object.type) {
      case 'rectangle':
        return (
          <Rect
            {...commonProps}
            x={object.x}
            y={object.y}
            width={object.width || 100}
            height={object.height || 100}
            fill={object.fill || '#4ECDC4'}
            stroke={object.stroke || '#333'}
            strokeWidth={object.strokeWidth || 2}
          />
        )

      case 'circle':
        return (
          <Circle
            {...commonProps}
            x={object.x + (object.width || 100) / 2}
            y={object.y + (object.height || 100) / 2}
            radius={(object.width || 100) / 2}
            fill={object.fill || '#4ECDC4'}
            stroke={object.stroke || '#333'}
            strokeWidth={object.strokeWidth || 2}
          />
        )

      case 'line':
        return (
          <Line
            {...commonProps}
            points={object.points || []}
            stroke={object.stroke || '#333'}
            strokeWidth={object.strokeWidth || 3}
            lineCap="round"
            lineJoin="round"
          />
        )

      case 'image':
        console.log('Rendering image:', object.id, 'imageElement:', !!imageElement)
        return (
          <KonvaImage
            {...commonProps}
            x={object.x}
            y={object.y}
            width={object.width || 200}
            height={object.height || 200}
            image={imageElement || undefined}
          />
        )

      case 'video':
        // For videos, we'll render a placeholder with play icon
        // The actual video will be handled by HTML overlay
         // Make placeholder slightly bigger than video for draggability
        { const placeholderPadding = 8
        return (
          <>
            <Rect
              {...commonProps}
              x={object.x - placeholderPadding}
              y={object.y - placeholderPadding}
              width={(object.width || 400) + (placeholderPadding * 2)}
              height={(object.height || 300) + (placeholderPadding * 2)}
              fill="#1a1a1a"
              stroke="#333"
              strokeWidth={2}
            />
            <Text
              x={object.x + (object.width || 400) / 2}
              y={object.y + (object.height || 300) / 2}
              text="▶ VIDEO"
              fontSize={24}
              fontFamily="Arial"
              fill="#fff"
              align="center"
              verticalAlign="middle"
              offsetX={30}
              offsetY={12}
              listening={false}
            />
          </>
        ) }

      default:
        return null
    }
  }

  return (
    <>
      {renderShape()}

      {/* Render text inside rectangles */}
      {object.type === 'rectangle' && object.text && (
        <Text
          x={object.x + 10}
          y={object.y + 10}
          text={object.text}
          fontSize={object.fontSize || 14}
          fontFamily="Arial"
          fill="#333"
          width={(object.width || 100) - 20}
          height={(object.height || 100) - 20}
          align="center"
          verticalAlign="middle"
          listening={false}
        />
      )}

      {isSelected && (
        <Transformer
          ref={transformerRef}
          flipEnabled={false}
          boundBoxFunc={(oldBox, newBox) => {
            // Limit resize
            if (Math.abs(newBox.width) < 5 || Math.abs(newBox.height) < 5) {
              return oldBox
            }
            return newBox
          }}
        />
      )}
    </>
  )
}

export default DrawableShape
