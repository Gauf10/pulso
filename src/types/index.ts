export type EventStatus = 'pending' | 'in_progress' | 'done'

export interface GoogleAccount {
  id: string
  userId: string
  email: string
  provider: string
  status: 'active' | 'inactive'
  accessToken?: string
  refreshToken?: string
  tokenExpiry?: number
}

export interface Calendar {
  id: string
  googleAccountId: string
  googleCalendarId: string
  name: string
  color: string
  selected: boolean
}

export interface Task {
  id: string
  userId: string
  googleAccountId: string
  googleCalendarId: string
  googleEventId: string
  title: string
  start: string
  end: string
  calendarName: string
  description: string
  location: string
  links: string[]
  status: EventStatus
  estimatedDurationMinutes: number
  actualDurationMinutes: number
  createdAt: string
  updatedAt: string
  rescheduleCount: number
}

export interface Subtask {
  id: string
  taskId: string
  title: string
  completed: boolean
  order: number
  estimatedDurationMinutes: number
  actualDurationMinutes: number
}

export interface RescheduleHistory {
  id: string
  taskId: string
  previousStart: string
  previousEnd: string
  newStart: string
  newEnd: string
  createdAt: string
}

export interface AISettings {
  enabled: boolean
}

export interface DayEvents {
  date: string
  tasks: Task[]
}
