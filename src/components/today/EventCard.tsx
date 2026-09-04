import type { Task } from '../../types'
import { formatTime } from '../../services/eventMapper'
import { formatDuration } from '../../services/durationService'

interface Props {
  task: Task
  subtaskCount?: number
  subtaskDone?: number
  onClick: () => void
  onStatusChange: (status: Task['status']) => void
  onMove: () => void
}

export default function EventCard({ task, subtaskCount, subtaskDone, onClick, onStatusChange, onMove }: Props) {
  const statusIcon = task.status === 'done' ? '☑' : task.status === 'in_progress' ? '◐' : '☐'
  const statusClass = task.status === 'done' ? 'event-done' : task.status === 'in_progress' ? 'event-progress' : ''

  return (
    <div className={`event-card ${statusClass}`} onClick={onClick}>
      <div className="event-time">
        {formatTime(task.start)}
      </div>

      <div className="event-body">
        <div className="event-title">{task.title}</div>
        <div className="event-meta">
          <span className="event-calendar">{task.calendarName || 'Calendario'}</span>
          <span className="event-duration">{formatDuration(task.estimatedDurationMinutes)}</span>
        </div>

        {subtaskCount !== undefined && subtaskCount > 0 && (
          <div className="event-subtasks-preview">
            {subtaskDone}/{subtaskCount} subtareas
          </div>
        )}

        {task.rescheduleCount > 0 && (
          <div className="event-reschedule-badge">
            Movido {task.rescheduleCount} vez{task.rescheduleCount > 1 ? 'es' : ''}
          </div>
        )}
      </div>

      <div className="event-actions" onClick={e => e.stopPropagation()}>
        {task.status !== 'done' && (
          <button className="event-action-btn" title="Mover a mañana" onClick={onMove}>
            →
          </button>
        )}
        <button
          className={`event-status-btn ${task.status === 'done' ? 'done' : ''}`}
          onClick={() => onStatusChange(task.status === 'done' ? 'pending' : 'done')}
        >
          {statusIcon}
        </button>
      </div>
    </div>
  )
}
