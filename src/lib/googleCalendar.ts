const BASE = 'https://www.googleapis.com/calendar/v3'

export interface GoogleCalendarEvent {
  id: string
  summary: string
  description?: string
  location?: string
  start: { dateTime?: string; date?: string; timeZone?: string }
  end: { dateTime?: string; date?: string; timeZone?: string }
  htmlLink: string
  calendarId?: string
  colorId?: string
  attendees?: { email: string; displayName?: string }[]
}

export interface GoogleCalendarListEntry {
  id: string
  summary: string
  backgroundColor?: string
  primary?: boolean
  accessRole?: string
}

async function gFetch(url: string, token: string, opts?: RequestInit) {
  console.log('[Pulso gFetch] URL:', url, 'token length:', token?.length)
  const res = await fetch(url, {
    ...opts,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...opts?.headers,
    },
  })
  console.log('[Pulso gFetch] Response:', res.status, res.statusText)
  if (!res.ok) {
    const body = await res.text()
    console.error('[Pulso gFetch] Error body:', body)
    throw new Error(`Google API ${res.status}: ${body}`)
  }
  return res.json()
}

export async function listCalendars(token: string): Promise<GoogleCalendarListEntry[]> {
  const data = await gFetch(`${BASE}/users/me/calendarList?maxResults=250`, token)
  return data.items || []
}

export async function getEvents(
  token: string,
  calendarId: string,
  timeMin: string,
  timeMax: string
): Promise<GoogleCalendarEvent[]> {
  const cal = encodeURIComponent(calendarId)
  const data = await gFetch(
    `${BASE}/calendars/${cal}/events?timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&orderBy=startTime&maxResults=100`,
    token
  )
  return (data.items || []).map((e: GoogleCalendarEvent) => ({ ...e, calendarId }))
}

export async function moveEvent(
  token: string,
  calendarId: string,
  eventId: string,
  newStart: string,
  newEnd: string
): Promise<GoogleCalendarEvent> {
  const cal = encodeURIComponent(calendarId)
  return gFetch(`${BASE}/calendars/${cal}/events/${eventId}`, token, {
    method: 'PATCH',
    body: JSON.stringify({
      start: { dateTime: newStart },
      end: { dateTime: newEnd },
    }),
  })
}
