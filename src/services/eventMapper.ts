import type { GoogleCalendarEvent } from '../lib/googleCalendar'
import type { Task } from '../types'

export function eventToTask(
  event: GoogleCalendarEvent,
  userId: string,
  googleAccountId: string
): Omit<Task, 'id'> {
  const startStr = event.start.dateTime || event.start.date || ''
  const endStr = event.end.dateTime || event.end.date || ''

  const start = new Date(startStr)
  const end = new Date(endStr)
  const durationMinutes = Math.max(1, Math.round((end.getTime() - start.getTime()) / 60000))

  const links = extractLinks(event.description || '')

  return {
    userId,
    googleAccountId,
    googleCalendarId: event.calendarId || '',
    googleEventId: event.id,
    title: event.summary || '(Sin título)',
    start: startStr,
    end: endStr,
    calendarName: '',
    description: event.description || '',
    location: event.location || '',
    links,
    status: 'pending',
    estimatedDurationMinutes: durationMinutes,
    actualDurationMinutes: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    rescheduleCount: 0,
  }
}

function extractLinks(text: string): string[] {
  const urlRegex = /https?:\/\/[^\s<>")\]]+/g
  return (text.match(urlRegex) || []).map(u => u.replace(/[.,;:!?)\]]+$/, ''))
}

export function getDayKey(dateStr: string): string {
  return dateStr.slice(0, 10)
}

export function formatTime(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00')
  return d.toLocaleDateString('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
}

export function today(): string {
  return new Date().toISOString().slice(0, 10)
}

export function addDays(dateStr: string, delta: number): string {
  const d = new Date(dateStr + 'T12:00:00')
  d.setDate(d.getDate() + delta)
  return d.toISOString().slice(0, 10)
}
