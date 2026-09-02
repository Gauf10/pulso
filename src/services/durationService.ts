const DURATION_RULES: { pattern: RegExp; min: number; max: number }[] = [
  { pattern: /reun[ióo]n|meeting|call|llamada/i, min: 30, max: 60 },
  { pattern: /responder|respuesta|mensaje|mail|email/i, min: 10, max: 20 },
  { pattern: /preparar|armar|crear|presentaci[oó]n|charla|propuesta/i, min: 45, max: 90 },
  { pattern: /investigar|buscar|anali[sz]/i, min: 30, max: 60 },
  { pattern: /escribir|redactar|draft/i, min: 30, max: 60 },
  { pattern: /gimnasio|gym|ejercicio|correr/i, min: 30, max: 90 },
  { pattern: /comer|almorzar|desayunar|cenar|merendar/i, min: 20, max: 45 },
  { pattern: /leer|art[ií]culo|libro/i, min: 15, max: 45 },
  { pattern: /revisar|check|verificar/i, min: 10, max: 30 },
]

export function suggestDuration(title: string, description?: string, calendarDurationMinutes?: number): number {
  const text = `${title} ${description || ''}`.toLowerCase()

  for (const rule of DURATION_RULES) {
    if (rule.pattern.test(text)) {
      return Math.round((rule.min + rule.max) / 2)
    }
  }

  // Fallback: use calendar duration or 30 min
  return calendarDurationMinutes || 30
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h}h ${m}min` : `${h}h`
}
