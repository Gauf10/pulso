import { useState } from 'react'
import type { Task } from '../../types'
import type { User } from 'firebase/auth'
import { addDays, formatTime, today } from '../../services/eventMapper'
import { useSubtasks } from '../../hooks/useSubtasks'

interface Props {
  tasks: Task[]
  user: User
  onMoveTask: (taskId: string, newStart: string, newEnd: string) => Promise<void>
  onStatusChange: (taskId: string, status: Task['status']) => void
  onRefresh: () => void
  onToast: (msg: string, type?: 'info' | 'success' | 'error') => void
}

export default function DayClosure({ tasks, user, onMoveTask, onStatusChange, onRefresh, onToast }: Props) {
  const pending = tasks.filter(t => t.status !== 'done')
  const tomorrow = addDays(today(), 1)

  const handleMoveTomorrow = async (task: Task) => {
    const start = task.start.replace(/^\d{4}-\d{2}-\d{2}/, tomorrow)
    const end = task.end.replace(/^\d{4}-\d{2}-\d{2}/, tomorrow)
    onToast('Movido a mañana', 'success')
    await onMoveTask(task.id, start, end)
    onRefresh()
  }

  const handleMoveToDate = async (task: Task, date: string) => {
    const start = task.start.replace(/^\d{4}-\d{2}-\d{2}/, date)
    const end = task.end.replace(/^\d{4}-\d{2}-\d{2}/, date)
    const label = new Date(date + 'T12:00:00').toLocaleDateString('es-AR', { weekday: 'short', day: 'numeric', month: 'short' })
    onToast(`Movido a ${label}`, 'success')
    await onMoveTask(task.id, start, end)
    onRefresh()
  }

  const handleDone = (taskId: string) => {
    onStatusChange(taskId, 'done')
    onToast('Marcado como hecho', 'success')
  }

  const handleSplit = (task: Task) => {
    onToast('Próximamente: dividir tareas', 'info')
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
            onDone={() => handleDone(task.id)}
            onMoveToDate={(date) => handleMoveToDate(task, date)}
            onSplit={() => handleSplit(task)}
          />
        ))}
      </div>
    </div>
  )
}

function ClosureCard({ task, user, onMoveTomorrow, onDone, onMoveToDate, onSplit }: {
  task: Task; user: User
  onMoveTomorrow: () => void; onDone: () => void
  onMoveToDate: (date: string) => void; onSplit: () => void
}) {
  const { subtasks } = useSubtasks(user, task.id)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [pickedDate, setPickedDate] = useState(today())

  const taskDate = new Date(task.start)
  const dayLabel = taskDate.toLocaleDateString('es-AR', { weekday: 'short', day: 'numeric', month: 'short' })
  const timeLabel = formatTime(task.start)

  return (
    <div className="closure-card">
      <div className="closure-card-header">
        <span className="closure-card-title">{task.title}</span>
        <span className="closure-card-time">{dayLabel} {timeLabel}</span>
      </div>

      {subtasks.length > 0 && (
        <div className="closure-card-subtasks">
          {subtasks.filter(s => !s.completed).map(s => (
            <span key={s.id} className="closure-card-subtask">☐ {s.title}</span>
          ))}
        </div>
      )}

      <div className="closure-card-actions">
        <button className="btn btn-primary btn-sm" onClick={onDone}>
          ☑ Hecho
        </button>
        <button className="btn btn-ghost btn-sm" onClick={onMoveTomorrow}>
          → Mañana
        </button>
        <button className="btn btn-ghost btn-sm" onClick={() => setShowDatePicker(!showDatePicker)}>
          Elegir fecha
        </button>
        <button className="btn btn-ghost btn-sm" onClick={onSplit}>
          Dividir
        </button>
      </div>

      {showDatePicker && (
        <div className="closure-date-picker">
          <input
            type="date"
            value={pickedDate}
            min={today()}
            onChange={e => setPickedDate(e.target.value)}
          />
          <button className="btn btn-primary btn-sm" onClick={() => { onMoveToDate(pickedDate); setShowDatePicker(false) }}>
            Mover
          </button>
        </div>
      )}

      {task.rescheduleCount >= 3 && (
        <div className="closure-reschedule-alert">
          Esta tarea fue reprogramada {task.rescheduleCount} veces
        </div>
      )}
    </div>
  )
}
