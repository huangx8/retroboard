import { 
  MousePointer2, 
  Square, 
  Circle, 
  Pen, 
  Image, 
  Video,
  Download,
  Trash2,
  ZoomIn,
  ZoomOut,
  RefreshCw
} from 'lucide-react'
import './Toolbar.css'

interface ToolbarProps {
  selectedTool: string
  onToolSelect: (tool: string) => void
  onClearAll?: () => void
  onExport?: () => void
  onZoomIn?: () => void
  onZoomOut?: () => void
  onZoomReset?: () => void
}

const tools = [
  { id: 'select', icon: MousePointer2, label: 'Select' },
  { id: 'rectangle', icon: Square, label: 'Rectangle' },
  { id: 'circle', icon: Circle, label: 'Circle' },
  { id: 'pen', icon: Pen, label: 'Pen' },
  { id: 'image', icon: Image, label: 'Image' },
  { id: 'video', icon: Video, label: 'Video' },
]

const actions = [
  { id: 'download', icon: Download, label: 'Export' },
  { id: 'clear', icon: Trash2, label: 'Clear All' },
]

const zoomActions = [
  { id: 'zoomIn', icon: ZoomIn, label: 'Zoom In' },
  { id: 'zoomOut', icon: ZoomOut, label: 'Zoom Out' },
  { id: 'zoomReset', icon: RefreshCw, label: 'Reset Zoom' },
]

const Toolbar = ({ selectedTool, onToolSelect, onClearAll, onExport, onZoomIn, onZoomOut, onZoomReset }: ToolbarProps) => {
  const handleActionClick = (actionId: string) => {
    switch (actionId) {
      case 'download':
        onExport?.()
        break
      case 'clear':
        // Implement clear all functionality
        if (window.confirm('Are you sure you want to clear the entire board?')) {
          onClearAll?.()
        }
        break
    }
  }

  return (
    <div className="toolbar">
      <div className="toolbar-section">
        <div className="toolbar-group">
          <span className="toolbar-label">Tools</span>
          <div className="toolbar-buttons">
            {tools.map((tool) => {
              const IconComponent = tool.icon
              return (
                <button
                  key={tool.id}
                  className={`toolbar-btn ${selectedTool === tool.id ? 'active' : ''}`}
                  onClick={() => onToolSelect(tool.id)}
                  title={tool.label}
                  style={tool.id === 'select' ? { cursor: 'pointer' } : {}}
                >
                  <IconComponent size={18} strokeWidth={1.5} />
                </button>
              )
            })}
          </div>
        </div>

        <div className="toolbar-divider" />

        <div className="toolbar-group">
          <span className="toolbar-label">Actions</span>
          <div className="toolbar-buttons">
            {actions.map((action) => {
              const IconComponent = action.icon
              return (
                <button
                  key={action.id}
                  className="toolbar-btn"
                  onClick={() => handleActionClick(action.id)}
                  title={action.label}
                >
                  <IconComponent size={18} strokeWidth={1.5} />
                </button>
              )
            })}
          </div>
        </div>

        <div className="toolbar-divider" />

        <div className="toolbar-group">
          <span className="toolbar-label">Zoom</span>
          <div className="toolbar-buttons">
            {zoomActions.map((action) => {
              const IconComponent = action.icon
              return (
                <button
                  key={action.id}
                  className="toolbar-btn"
                  onClick={() => {
                    if (action.id === 'zoomIn') onZoomIn?.()
                    if (action.id === 'zoomOut') onZoomOut?.()
                    if (action.id === 'zoomReset') onZoomReset?.()
                  }}
                  title={action.label}
                >
                  <IconComponent size={18} strokeWidth={1.5} />
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Toolbar
