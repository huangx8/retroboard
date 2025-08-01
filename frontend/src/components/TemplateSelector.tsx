import { useState } from 'react'
import { Plus, Layout, Users, Target, Lightbulb } from 'lucide-react'
import './TemplateSelector.css'

interface Template {
  id: string
  name: string
  description: string
  icon: React.ComponentType<any>
  sections: Array<{
    title: string
    color: string
    x: number
    y: number
  }>
}

interface TemplateSelectorProps {
  onTemplateSelect: (template: Template) => void
  onClose: () => void
}

const templates: Template[] = [
  {
    id: 'retrospective',
    name: 'Sprint Retrospective',
    description: 'Classic retrospective with What went well, What to improve, and Action items',
    icon: Users,
    sections: [
      { title: 'What went well? 😊', color: '#4ECDC4', x: 100, y: 100 },
      { title: 'What to improve? 🤔', color: '#FF6B6B', x: 400, y: 100 },
      { title: 'Action items 🎯', color: '#FECA57', x: 700, y: 100 }
    ]
  },
  {
    id: 'starfish',
    name: 'Starfish Retrospective',
    description: 'Start doing, Stop doing, Continue doing, More of, Less of',
    icon: Target,
    sections: [
      { title: 'Start Doing ⭐', color: '#4ECDC4', x: 100, y: 80 },
      { title: 'Stop Doing ⛔', color: '#FF6B6B', x: 500, y: 80 },
      { title: 'Continue Doing ✅', color: '#96CEB4', x: 100, y: 300 },
      { title: 'More Of 📈', color: '#FECA57', x: 300, y: 450 },
      { title: 'Less Of 📉', color: '#FF9FF3', x: 500, y: 300 }
    ]
  },
  {
    id: 'brainstorming',
    name: 'Brainstorming Session',
    description: 'Open canvas for creative brainstorming and idea generation',
    icon: Lightbulb,
    sections: [
      { title: 'Ideas 💡', color: '#FECA57', x: 200, y: 150 },
      { title: 'Questions ❓', color: '#54A0FF', x: 600, y: 150 }
    ]
  },
  {
    id: 'blank',
    name: 'Blank Canvas',
    description: 'Start with a completely blank canvas',
    icon: Layout,
    sections: []
  }
]

const TemplateSelector = ({ onTemplateSelect, onClose }: TemplateSelectorProps) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')

  const handleTemplateClick = (template: Template) => {
    setSelectedTemplate(template.id)
    onTemplateSelect(template)
  }

  return (
    <div className="template-selector-overlay">
      <div className="template-selector">
        <div className="template-header">
          <h2>Choose a Template</h2>
          <p>Select a template to get started quickly, or choose blank canvas for freestyle</p>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="templates-grid">
          {templates.map((template) => {
            const IconComponent = template.icon
            return (
              <div
                key={template.id}
                className={`template-card ${selectedTemplate === template.id ? 'selected' : ''}`}
                onClick={() => handleTemplateClick(template)}
              >
                <div className="template-icon">
                  <IconComponent size={32} />
                </div>
                <h3>{template.name}</h3>
                <p>{template.description}</p>
                <div className="template-preview">
                  {template.sections.slice(0, 3).map((section, index) => (
                    <div
                      key={index}
                      className="preview-section"
                      style={{ backgroundColor: section.color }}
                    />
                  ))}
                  {template.sections.length > 3 && (
                    <div className="preview-more">+{template.sections.length - 3}</div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        <div className="template-actions">
          <button onClick={onClose} className="cancel-btn">
            Cancel
          </button>
          <button
            onClick={() => onTemplateSelect(templates.find(t => t.id === 'blank')!)}
            className="blank-btn"
          >
            <Plus size={16} />
            Start Blank
          </button>
        </div>
      </div>
    </div>
  )
}

export default TemplateSelector
