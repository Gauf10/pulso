import type { Calendar } from '../../types'
import type { User } from 'firebase/auth'

interface Props {
  user: User
  calendars: Calendar[]
  selectedCalendars: Set<string>
  aiEnabled: boolean
  onToggleCalendar: (id: string) => void
  onToggleAI: () => void
}

export default function SettingsPage({ user, calendars, selectedCalendars, aiEnabled, onToggleCalendar, onToggleAI }: Props) {
  return (
    <div className="settings-page">
      <h2 className="settings-title">Configuración</h2>

      {/* Cuenta */}
      <div className="settings-section">
        <h3>Cuenta</h3>
        <p className="settings-desc">{user.email}</p>
      </div>

      {/* Calendarios */}
      <div className="settings-section">
        <h3>Calendarios</h3>
        <p className="settings-desc">Elegí qué calendarios mostrar en Pulso</p>
        <div className="settings-calendars">
          {calendars.map(cal => (
            <label key={cal.googleCalendarId} className="settings-calendar-item">
              <input
                type="checkbox"
                checked={selectedCalendars.has(cal.googleCalendarId)}
                onChange={() => onToggleCalendar(cal.googleCalendarId)}
              />
              <span className="settings-calendar-dot" style={{ background: cal.color }} />
              <span>{cal.name}</span>
            </label>
          ))}
          {calendars.length === 0 && (
            <p className="settings-empty">No se encontraron calendarios</p>
          )}
        </div>
      </div>

      {/* IA */}
      <div className="settings-section">
        <h3>Inteligencia artificial</h3>
        <p className="settings-desc">
          Cuando está activa, Pulso puede sugerir subtareas y duraciones.
          Tus datos nunca se envían si está desactivada.
        </p>
        <div className="settings-toggle">
          <span>Sugerencias IA</span>
          <label className="switch">
            <input type="checkbox" checked={aiEnabled} onChange={onToggleAI} />
            <span className="switch-slider" />
          </label>
        </div>
      </div>
    </div>
  )
}
