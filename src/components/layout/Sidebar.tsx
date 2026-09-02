interface Props {
  currentPage: string
  onNavigate: (page: string) => void
  onClose: () => void
  onLogout: () => void
  userName: string | null
  open: boolean
}

const NAV = [
  { id: 'today', label: 'Hoy', icon: '◉' },
  { id: 'pending', label: 'Pendientes', icon: '☐' },
  { id: 'closure', label: 'Cierre', icon: '◐' },
  { id: 'settings', label: 'Configuración', icon: '⚙' },
]

export default function Sidebar({ currentPage, onNavigate, onClose, onLogout, userName, open }: Props) {
  return (
    <>
      <div className={`sidebar ${open ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <span className="sidebar-logo-icon">◉</span>
            <span className="sidebar-title">Pulso</span>
          </div>
          <button className="sidebar-close" onClick={onClose}>✕</button>
        </div>

        <nav className="sidebar-nav">
          {NAV.map(item => (
            <button
              key={item.id}
              className={`sidebar-link ${currentPage === item.id ? 'active' : ''}`}
              onClick={() => onNavigate(item.id)}
            >
              <span className="sidebar-link-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            {userName && <span className="sidebar-name">{userName}</span>}
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onLogout}>Salir</button>
        </div>
      </div>
    </>
  )
}
