import { useState, useEffect, useCallback } from 'react'
import type { Task } from '../../types'
import type { User } from 'firebase/auth'
import * as fs from '../../services/firestoreService'
import EventCard from '../today/EventCard'

interface Props {
  user: User
  onOpenTask: (task: Task) => void
}

export default function PendingPage({ user, onOpenTask }: Props) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPending()
  }, [user])

  const loadPending = async () => {
    setLoading(true)
    try {
      const all = await fs.getAllTasks(user.uid)
      const pending = all
        .filter(t => t.status !== 'done')
        .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
      setTasks(pending)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="pending-page">
        <h2 className="pending-title">Pendientes</h2>
        <div className="day-loading"><div className="day-loading-spinner" /></div>
      </div>
    )
  }

  return (
    <div className="pending-page">
      <h2 className="pending-title">Pendientes</h2>
      <p className="pending-subtitle">{tasks.length} tarea{tasks.length !== 1 ? 's' : ''} pendiente{tasks.length !== 1 ? 's' : ''}</p>

      {tasks.length === 0 ? (
        <div className="day-empty"><p>No hay pendientes</p></div>
      ) : (
        <div className="day-events">
          {tasks.map(task => (
            <EventCard
              key={task.id}
              task={task}
              onClick={() => onOpenTask(task)}
              onStatusChange={() => {}}
            />
          ))}
        </div>
      )}
    </div>
  )
}
