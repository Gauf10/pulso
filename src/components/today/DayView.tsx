import { useState } from 'react'
import type { Task } from '../../types'
import type { User } from 'firebase/auth'
import { addDays, today } from '../../services/eventMapper'
import EventCard from './EventCard'
import EventDetail from './EventDetail'
import * as fs from '../../services/firestoreService'

interface Props {
  tasks: Task[]
  user: User
  selectedDate: string
  loading: boolean
  error: string | null
  onDateChange: (delta: number) => void
  onGoToday: () => void
  onRefresh: () => void
  onStatusChange: (taskId: string, status: Task['status'], actualDuration?: number) => void
  onMove: (taskId: string) => void
  onEstimatedDurationChange: (taskId: string, minutes: number) => void
}

export default function DayView({
  tasks, user, selectedDate, loading, error,
  onDateChange, onGoToday, onRefresh,
  onStatusChange, onMove, onEstimatedDurationChange,
}: Props) {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [subtaskCounts, setSubtaskCounts] = useState<Record<string, { total: number; done: number }>>({})

  useState(() => {
    tasks.forEach(async task => {
      const subtasks = await fs.getSubtasks(user.uid, task.id)
      setSubtaskCounts(prev => ({
        ...prev,
        [task.id]: {
          total: subtasks.length,
          done: subtasks.filter(s => s.completed).length,
        },
      }))
    })
  })

  const isToday = selectedDate === today()
  const dateLabel = new Date(selectedDate + 'T12:00:00').toLocaleDateString('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

  return (
    <div className="day-view">
      <div className="day-header">
        <button className="btn btn-icon btn-ghost" onClick={() => onDateChange(-1)}>‹</button>
        <div className="day-header-center">
          <h1 className="day-date">{dateLabel}</h1>
          {!isToday && (
            <button className="btn btn-ghost btn-sm" onClick={onGoToday}>Ir a hoy</button>
          )}
        </div>
        <button className="btn btn-icon btn-ghost" onClick={() => onDateChange(1)}>›</button>
      </div>

      {error && (
        <div className="day-error">
          <p>{error}</p>
          <p className="day-error-hint">Verificá que la Google Calendar API esté habilitada en Google Cloud Console.</p>
        </div>
      )}

      {loading ? (
        <div className="day-loading">
          <div className="day-loading-spinner" />
          <span>Cargando eventos...</span>
        </div>
      ) : tasks.length === 0 && !error ? (
        <div className="day-empty">
          <p>No hay eventos para este día</p>
        </div>
      ) : (
        <div className="day-events">
          {tasks.map(task => (
            <EventCard
              key={task.id}
              task={task}
              subtaskCount={subtaskCounts[task.id]?.total}
              subtaskDone={subtaskCounts[task.id]?.done}
              onClick={() => setSelectedTask(task)}
              onStatusChange={(status) => onStatusChange(task.id, status)}
            />
          ))}
        </div>
      )}

      {selectedTask && (
        <EventDetail
          task={selectedTask}
          user={user}
          onClose={() => setSelectedTask(null)}
          onStatusChange={(status, actual) => {
            onStatusChange(selectedTask.id, status, actual)
            setSelectedTask(null)
            onRefresh()
          }}
          onMove={(taskId) => {
            onMove(taskId)
            setSelectedTask(null)
          }}
          onEstimatedDurationChange={onEstimatedDurationChange}
        />
      )}
    </div>
  )
}
