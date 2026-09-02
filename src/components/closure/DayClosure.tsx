import { useState } from 'react'
import type { Task } from '../../types'
import type { User } from 'firebase/auth'
import { addDays, formatDate, today } from '../../services/eventMapper'
import { useSubtasks } from '../../hooks/useSubtasks'

interface Props {
  tasks: Task[]
  user: User
  onMoveTask: (taskId: string, newStart: string, newEnd: string) => Promise<void>
  onRefresh: () => void
}

export default function DayClosure({ tasks, user, onMoveTask, onRefresh }: Props) {
  const pending = tasks.filter(t => t.status !== 'done')
  const [moving, setMoving] = useState<string | null>(null)
  const tomorrow = addDays(today(), 1)

  const handleMoveTomorrow = async (task: Task) => {
    const start = task.start.replace(/^\d{4}-\d{2}-\d{2}/, tomorrow)
    const end = task.end.replace(/^\d{4}-\d{2}-\d{2}/, tomorrow)
    await onMoveTask(task.id, start, end)
    onRefresh()
  }

  if (pending.length === 0) {
    return (
      <div className="closure-page">
        <h2 className="closure-title">Cierre del día</h2>
        <div className="closure-empty">
          <p>No quedaron pendientes. Buen trabajo.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="closure-page">
      <h2 className="closure-title">Cierre del día</h2>
      <p className="closure-subtitle">Te quedaron {pending.length} cosa{pending.length > 1 ? 's' : ''}</p>

      <div className="closure-list">
        {pending.map(task => (
          <ClosureCard
            key={task.id}
            task={task}
            user={user}
            onMoveTomorrow={() => handleMoveTomorrow(task)}
          />
        ))}
      </div>
    </div>
  )
}

function ClosureCard({ task, user, onMoveTomorrow }: { task: Task; user: User; onMoveTomorrow: () => void }) {
  const { subtasks } = useSubtasks(user, task.id)
  const [showOptions, setShowOptions] = useState(false)

  return (
    <div className="closure-card">
      <div className="closure-card-header">
        <span className="closure-card-title">{task.title}</span>
        <span className="closure-card-duration">{task.estimatedDurationMinutes} min</span>
      </div>

      {subtasks.length > 0 && (
        <div className="closure-card-subtasks">
          {subtasks.filter(s => !s.completed).map(s => (
            <span key={s.id} className="closure-card-subtask">☐ {s.title}</span>
          ))}
        </div>
      )}

      <div className="closure-card-actions">
        <button className="btn btn-primary btn-sm" onClick={onMoveTomorrow}>
          → Mañana
        </button>
        <button className="btn btn-ghost btn-sm" onClick={() => setShowOptions(!showOptions)}>
          Elegir fecha
        </button>
        <button className="btn btn-ghost btn-sm">
          Dividir
        </button>
        <button className="btn btn-ghost btn-sm btn-danger">
          Descartar
        </button>
      </div>

      {task.rescheduleCount >= 3 && (
        <div className="closure-reschedule-alert">
          Esta tarea fue reprogramada {task.rescheduleCount} veces
        </div>
      )}
    </div>
  )
}
