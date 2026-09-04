import { useState, useCallback, useRef, useEffect } from 'react'
import type { User } from 'firebase/auth'
import type { Task, Subtask, Calendar } from '../types'
import type { GoogleCalendarEvent } from '../lib/googleCalendar'
import { listCalendars, getEvents, moveEvent as gcalMove } from '../lib/googleCalendar'
import { eventToTask } from '../services/eventMapper'
import { suggestDuration } from '../services/durationService'
import * as fs from '../services/firestoreService'
import { today, addDays } from '../services/eventMapper'

export function useCalendar(user: User, accessToken: string) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [calendars, setCalendars] = useState<Calendar[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState(() => today())
  const [selectedCalendars, setSelectedCalendars] = useState<Set<string>>(new Set())
  const tokenRef = useRef(accessToken)

  useEffect(() => {
    tokenRef.current = accessToken
  }, [accessToken])

  const loadCalendars = useCallback(async (token: string) => {
    if (!user || !token) return
    try {
      const gcalendars = await listCalendars(token)
      const userCalendars: Calendar[] = gcalendars.map(gc => ({
        id: gc.id,
        googleAccountId: user.uid,
        googleCalendarId: gc.id,
        name: gc.summary,
        color: gc.backgroundColor || '#4285f4',
        selected: true,
      }))
      setCalendars(userCalendars)
      setSelectedCalendars(new Set(userCalendars.map(c => c.googleCalendarId)))
      setError(null)
      for (const cal of userCalendars) {
        await fs.saveCalendar(user.uid, cal)
      }
    } catch (err: any) {
      console.error('Error loading calendars:', err)
      setError(`No se pudieron cargar los calendarios: ${err.message || err}`)
    }
  }, [user])

  const loadTasks = useCallback(async (date: string, token?: string) => {
    const t = token || tokenRef.current
    if (!user || !t) return
    setLoading(true)
    setError(null)
    try {
      const timeMin = `${date}T00:00:00-05:00`
      const timeMax = `${date}T23:59:59-05:00`

      const allEvents: GoogleCalendarEvent[] = []
      for (const calId of selectedCalendars) {
        try {
          const events = await getEvents(t, calId, timeMin, timeMax)
          allEvents.push(...events)
        } catch (err: any) {
          console.warn(`Error fetching calendar ${calId}:`, err.message || err)
        }
      }

      // Filter out work location events and all-day events from other days
      const filteredEvents = allEvents.filter(e => {
        if (e.summary?.startsWith('Lugar de trabajo:')) return false
        // All-day events (date only, no dateTime) must match the selected date
        if (e.start.date && !e.start.dateTime) {
          return e.start.date === date
        }
        return true
      })

      // Batch-fetch existing tasks for this date range from Firestore
      const existingTasks = await fs.getTasksForDate(user.uid, date)
      const existingByEventId = new Map(existingTasks.map(t => [t.googleEventId, t]))

      const seen = new Set<string>()
      const newTasks: Task[] = []
      for (const event of filteredEvents) {
        if (seen.has(event.id)) continue
        seen.add(event.id)
        const taskData = eventToTask(event, user.uid, user.uid)
        const existing = existingByEventId.get(event.id)
        if (existing) {
          newTasks.push({ ...taskData, id: existing.id, status: existing.status, estimatedDurationMinutes: existing.estimatedDurationMinutes, actualDurationMinutes: existing.actualDurationMinutes, rescheduleCount: existing.rescheduleCount })
        } else {
          const calDuration = taskData.estimatedDurationMinutes
          taskData.estimatedDurationMinutes = suggestDuration(taskData.title, taskData.description, calDuration)
          const id = await fs.saveTask(user.uid, taskData)
          newTasks.push({ ...taskData, id })
        }
      }

      setTasks(newTasks.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()))
    } catch (err: any) {
      console.error('Error loading tasks:', err)
      setError(`No se pudieron cargar los eventos: ${err.message || err}`)
    } finally {
      setLoading(false)
    }
  }, [user, selectedCalendars])

  const refresh = useCallback(async () => {
    await loadTasks(selectedDate)
  }, [selectedDate, loadTasks])

  const moveTask = useCallback(async (taskId: string, newStart: string, newEnd: string) => {
    const task = tasks.find(t => t.id === taskId)
    if (!task || !user || !tokenRef.current) return

    try {
      await gcalMove(tokenRef.current, task.googleCalendarId, task.googleEventId, newStart, newEnd)
      // Record history
      await fs.addReschedule(user.uid, taskId, {
        taskId,
        previousStart: task.start,
        previousEnd: task.end,
        newStart,
        newEnd,
        createdAt: new Date().toISOString(),
      })
      // Update task
      const updated = { ...task, start: newStart, end: newEnd, rescheduleCount: task.rescheduleCount + 1 }
      await fs.updateTask(user.uid, taskId, updated)
      setTasks(prev => prev.map(t => t.id === taskId ? updated : t))
    } catch (err) {
      console.error('Error moving event:', err)
      throw err
    }
  }, [tasks, user])

  const updateTaskStatus = useCallback(async (taskId: string, status: Task['status'], actualDuration?: number) => {
    if (!user) return
    const data: Partial<Task> = { status }
    if (actualDuration !== undefined) data.actualDurationMinutes = actualDuration
    await fs.updateTask(user.uid, taskId, data)
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, ...data } : t))
  }, [user])

  const updateEstimatedDuration = useCallback(async (taskId: string, minutes: number) => {
    if (!user) return
    await fs.updateTask(user.uid, taskId, { estimatedDurationMinutes: minutes })
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, estimatedDurationMinutes: minutes } : t))
  }, [user])

  const toggleCalendar = useCallback((calendarId: string) => {
    setSelectedCalendars(prev => {
      const next = new Set(prev)
      if (next.has(calendarId)) next.delete(calendarId)
      else next.add(calendarId)
      return next
    })
  }, [])

  return {
    tasks, calendars, loading, error, selectedDate, selectedCalendars,
    setSelectedDate, loadCalendars, loadTasks, refresh,
    moveTask, updateTaskStatus, updateEstimatedDuration, toggleCalendar,
  }
}

async function findTaskByGoogleEvent(userId: string, googleEventId: string): Promise<Task | null> {
  // Simple scan — for MVP with <100 daily events this is fine
  const all = await fs.getAllTasks(userId)
  return all.find(t => t.googleEventId === googleEventId) || null
}
