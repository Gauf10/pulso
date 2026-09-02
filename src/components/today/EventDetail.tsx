import { useState, useEffect } from 'react'
import type { Task } from '../../types'
import type { Subtask } from '../../types'
import { useSubtasks } from '../../hooks/useSubtasks'
import type { User } from 'firebase/auth'
import { formatTime, formatDate } from '../../services/eventMapper'
import { formatDuration } from '../../services/durationService'

interface Props {
  task: Task
  user: User
  onClose: () => void
  onStatusChange: (status: Task['status'], actualDuration?: number) => void
  onMove: (taskId: string) => void
  onEstimatedDurationChange: (taskId: string, minutes: number) => void
}

const DURATION_OPTIONS = [5, 10, 15, 20, 30, 45, 60, 90]

export default function EventDetail({ task, user, onClose, onStatusChange, onMove, onEstimatedDurationChange }: Props) {
  const { subtasks, addSubtask, toggleSubtask, deleteSubtask } = useSubtasks(user, task.id)
  const [newSubtask, setNewSubtask] = useState('')
  const [showDurationPicker, setShowDurationPicker] = useState(false)
  const [showActualDuration, setShowActualDuration] = useState(false)
  const [editingEstimate, setEditingEstimate] = useState(false)
  const [tempEstimate, setTempEstimate] = useState(task.estimatedDurationMinutes)

  const handleAddSubtask = async () => {
    if (!newSubtask.trim()) return
    await addSubtask(newSubtask.trim())
    setNewSubtask('')
  }

  const handleMarkDone = () => {
    setShowActualDuration(true)
  }

  const handleConfirmDone = (actualMinutes?: number) => {
    onStatusChange('done', actualMinutes)
    setShowActualDuration(false)
  }

  const handleSaveEstimate = () => {
    onEstimatedDurationChange(task.id, tempEstimate)
    setEditingEstimate(false)
  }

  const doneCount = subtasks.filter(s => s.completed).length

  return (
    <div className="detail-panel open">
      <div className="detail-panel-backdrop" onClick={onClose} />
      <div className="detail-panel-content">
        <div className="detail-panel-header">
          <h2 className="detail-panel-title">Detalle</h2>
          <button className="detail-panel-close" onClick={onClose}>✕</button>
        </div>

        <div className="detail-panel-body">
          <h3 className="detail-event-title">{task.title}</h3>

          <div className="detail-meta">
            <div className="detail-meta-row">
              <span className="detail-label">Fecha</span>
              <span>{formatDate(task.start)}</span>
            </div>
            <div className="detail-meta-row">
              <span className="detail-label">Hora</span>
              <span>{formatTime(task.start)} – {formatTime(task.end)}</span>
            </div>
            <div className="detail-meta-row">
              <span className="detail-label">Duración calendar</span>
              <span>{formatDuration(task.estimatedDurationMinutes)}</span>
            </div>
            {task.actualDurationMinutes > 0 && (
              <div className="detail-meta-row">
                <span className="detail-label">Duración real</span>
                <span className="detail-actual">{formatDuration(task.actualDurationMinutes)}</span>
              </div>
            )}
            <div className="detail-meta-row">
              <span className="detail-label">Calendario</span>
              <span>{task.calendarName || '—'}</span>
            </div>
            {task.location && (
              <div className="detail-meta-row">
                <span className="detail-label">Ubicación</span>
                <span>{task.location}</span>
              </div>
            )}
          </div>

          {/* Estimación Pulso */}
          <div className="detail-section">
            <div className="detail-section-header">
              <span className="detail-section-label">Estimación Pulso</span>
              <button className="btn btn-ghost btn-sm" onClick={() => { setTempEstimate(task.estimatedDurationMinutes); setEditingEstimate(true) }}>
                Editar
              </button>
            </div>
            {editingEstimate ? (
              <div className="detail-estimate-edit">
                <input
                  type="number"
                  value={tempEstimate}
                  onChange={e => setTempEstimate(Number(e.target.value))}
                  className="detail-input"
                  min={1}
                />
                <span className="detail-input-suffix">min</span>
                <button className="btn btn-primary btn-sm" onClick={handleSaveEstimate}>OK</button>
                <button className="btn btn-ghost btn-sm" onClick={() => setEditingEstimate(false)}>Cancelar</button>
              </div>
            ) : (
              <span className="detail-estimate-value">{formatDuration(task.estimatedDurationMinutes)}</span>
            )}
          </div>

          {/* Descripción */}
          {task.description && (
            <div className="detail-section">
              <span className="detail-section-label">Descripción</span>
              <div className="detail-description">{task.description}</div>
            </div>
          )}

          {/* Links */}
          {task.links.length > 0 && (
            <div className="detail-section">
              <span className="detail-section-label">Links</span>
              <div className="detail-links">
                {task.links.map((link, i) => (
                  <a key={i} href={link} target="_blank" rel="noopener noreferrer" className="detail-link">
                    {link.replace(/^https?:\/\//, '').slice(0, 40)}...
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Subtareas */}
          <div className="detail-section">
            <div className="detail-section-header">
              <span className="detail-section-label">
                Subtareas {subtasks.length > 0 ? `(${doneCount}/${subtasks.length})` : ''}
              </span>
            </div>

            <div className="detail-subtasks">
              {subtasks.map(st => (
                <div key={st.id} className={`detail-subtask ${st.completed ? 'completed' : ''}`}>
                  <button className="detail-subtask-check" onClick={() => toggleSubtask(st.id)}>
                    {st.completed ? '☑' : '☐'}
                  </button>
                  <span className="detail-subtask-title">{st.title}</span>
                  <button className="detail-subtask-delete" onClick={() => deleteSubtask(st.id)}>✕</button>
                </div>
              ))}
            </div>

            <div className="detail-add-subtask">
              <input
                value={newSubtask}
                onChange={e => setNewSubtask(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddSubtask()}
                placeholder="+ Subtarea"
                className="detail-input"
              />
              {newSubtask.trim() && (
                <button className="btn btn-primary btn-sm" onClick={handleAddSubtask}>+</button>
              )}
            </div>
          </div>

          {/* Acciones */}
          <div className="detail-actions">
            {task.status !== 'done' && (
              <button className="btn btn-primary" onClick={handleMarkDone}>
                Marcar como hecho
              </button>
            )}
            {task.status === 'done' && (
              <button className="btn btn-ghost" onClick={() => onStatusChange('pending')}>
                Desmarcar
              </button>
            )}
            <button className="btn btn-ghost" onClick={() => onMove(task.id)}>
              Mover
            </button>
          </div>

          {/* Duration picker overlay */}
          {showActualDuration && (
            <div className="duration-picker-overlay">
              <div className="duration-picker">
                <p>¿Cuánto te llevó?</p>
                <div className="duration-options">
                  {DURATION_OPTIONS.map(min => (
                    <button key={min} className="btn btn-ghost" onClick={() => handleConfirmDone(min)}>
                      {formatDuration(min)}
                    </button>
                  ))}
                </div>
                <div className="duration-custom">
                  <input
                    type="number"
                    placeholder="Otro (min)"
                    className="detail-input"
                    onKeyDown={e => {
                      if (e.key === 'Enter') handleConfirmDone(Number((e.target as HTMLInputElement).value))
                    }}
                  />
                </div>
                <button className="btn btn-ghost btn-sm" onClick={() => handleConfirmDone()}>Omitir</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
