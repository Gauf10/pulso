import { useState, useEffect } from 'react'
import './index.css'
import { useAuth } from './hooks/useAuth'
import { useCalendar } from './hooks/useCalendar'
import LoginScreen from './components/auth/LoginScreen'
import { useToast, ToastContainer } from './components/ui/Toast'
import Sidebar from './components/layout/Sidebar'
import DayView from './components/today/DayView'
import PendingPage from './components/pending/PendingPage'
import DayClosure from './components/closure/DayClosure'
import SettingsPage from './components/settings/SettingsPage'
import EventDetail from './components/today/EventDetail'
import { addDays, today } from './services/eventMapper'
import { formatDuration } from './services/durationService'
import { getUserSettings, saveUserSettings, ensureUserDoc } from './services/firestoreService'
import type { Task } from './types'

type Page = 'today' | 'pending' | 'closure' | 'settings'

function AppShell() {
  const { user, login, logout, accessToken, setAccessToken } = useAuth()
  const {
    tasks, calendars, loading, error, selectedDate, selectedCalendars,
    setSelectedDate, loadCalendars, loadTasks, refresh,
    moveTask, updateTaskStatus, updateEstimatedDuration, toggleCalendar,
  } = useCalendar(user!, accessToken)
  const { toasts, show: showToast, dismiss } = useToast()

  const [currentPage, setCurrentPage] = useState<Page>('today')
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth > 768)
  const [aiEnabled, setAiEnabled] = useState(false)
  const [detailTask, setDetailTask] = useState<Task | null>(null)

  // Init
  useEffect(() => {
    if (!user || !accessToken) return
    ensureUserDoc(user.uid)
    getUserSettings(user.uid).then(s => setAiEnabled(s.enabled))
    loadCalendars(accessToken)
  }, [user, accessToken])

  // Load tasks when calendars are ready or date changes
  useEffect(() => {
    if (accessToken && selectedCalendars.size > 0) loadTasks(selectedDate)
  }, [selectedDate, selectedCalendars, accessToken])

  const handleDateChange = (delta: number) => {
    setSelectedDate(addDays(selectedDate, delta))
  }

  const handleGoToday = () => {
    setSelectedDate(today())
  }

  const handleToggleAI = async () => {
    const next = !aiEnabled
    setAiEnabled(next)
    await saveUserSettings(user!.uid, { enabled: next })
  }

  const handleMoveFromDetail = (taskId: string) => {
    // Simple move: push to tomorrow
    const task = tasks.find(t => t.id === taskId)
    if (!task) return
    const tomorrow = addDays(today(), 1)
    const newStart = task.start.replace(/^\d{4}-\d{2}-\d{2}/, tomorrow)
    const newEnd = task.end.replace(/^\d{4}-\d{2}-\d{2}/, tomorrow)
    moveTask(taskId, newStart, newEnd).then(() => refresh())
    setDetailTask(null)
  }

  const handleMoveTomorrow = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId)
    if (!task) return
    const tomorrow = addDays(today(), 1)
    const newStart = task.start.replace(/^\d{4}-\d{2}-\d{2}/, tomorrow)
    const newEnd = task.end.replace(/^\d{4}-\d{2}-\d{2}/, tomorrow)
    showToast('Movido a mañana', 'success')
    moveTask(taskId, newStart, newEnd).then(() => refresh())
  }

  return (
    <div className="app-layout">
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}
      <Sidebar
        currentPage={currentPage}
        onNavigate={(page) => { setCurrentPage(page as Page); if (window.innerWidth <= 768) setSidebarOpen(false) }}
        onClose={() => setSidebarOpen(false)}
        onLogout={logout}
        userName={user?.displayName || user?.email || null}
        open={sidebarOpen}
      />

      <div className="main-content">
        <header className="topbar">
          <button className="btn btn-icon mobile-menu-btn" onClick={() => setSidebarOpen(v => !v)}>
            ☰
          </button>
          <div className="topbar-title">
            {currentPage === 'today' && '◉ Hoy'}
            {currentPage === 'pending' && '☐ Pendientes'}
            {currentPage === 'closure' && '◐ Cierre'}
            {currentPage === 'settings' && '⚙ Configuración'}
          </div>
          <div className="topbar-right">
            {currentPage === 'today' && (
              <button className="btn btn-ghost btn-sm" onClick={refresh}>↻</button>
            )}
          </div>
        </header>

        <div className="page-content">
          {currentPage === 'today' && (
            <DayView
              tasks={tasks}
              user={user!}
              selectedDate={selectedDate}
              loading={loading}
              error={error}
              onDateChange={handleDateChange}
              onGoToday={handleGoToday}
              onRefresh={refresh}
              onStatusChange={(taskId, status, actual) => {
                updateTaskStatus(taskId, status, actual)
                if (status === 'done') showToast('Marcado como hecho', 'success')
                else if (status === 'in_progress') showToast('En progreso', 'info')
                else showToast('Pendiente', 'info')
              }}
              onMove={(taskId) => {
                const task = tasks.find(t => t.id === taskId)
                if (task) setDetailTask(task)
              }}
              onMoveTomorrow={handleMoveTomorrow}
              onEstimatedDurationChange={updateEstimatedDuration}
            />
          )}

          {currentPage === 'pending' && (
            <PendingPage user={user!} onOpenTask={(t) => setDetailTask(t)} />
          )}

          {currentPage === 'closure' && (
            <DayClosure
              tasks={tasks}
              user={user!}
              onMoveTask={moveTask}
              onStatusChange={(taskId, status) => {
                updateTaskStatus(taskId, status)
                if (status === 'done') showToast('Marcado como hecho', 'success')
              }}
              onRefresh={refresh}
              onToast={showToast}
            />
          )}

          {currentPage === 'settings' && (
            <SettingsPage
              user={user!}
              calendars={calendars}
              selectedCalendars={selectedCalendars}
              aiEnabled={aiEnabled}
              onToggleCalendar={toggleCalendar}
              onToggleAI={handleToggleAI}
            />
          )}
        </div>
      </div>

      {/* Global detail panel for pending page */}
      {detailTask && currentPage !== 'today' && (
        <EventDetail
          task={detailTask}
          user={user!}
          onClose={() => setDetailTask(null)}
          onStatusChange={(status, actual) => {
            updateTaskStatus(detailTask.id, status, actual).then(() => {
              refresh()
              setDetailTask(null)
            })
            if (status === 'done') showToast('Marcado como hecho', 'success')
          }}
          onMove={handleMoveFromDetail}
          onEstimatedDurationChange={updateEstimatedDuration}
        />
      )}

      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </div>
  )
}

function SetupScreen() {
  return (
    <div className="login-screen">
      <div className="login-card">
        <img src="/pulso-192.png" alt="Pulso" className="login-logo-img" />
        <h1>Pulso</h1>
        <p className="login-subtitle">Tu agenda, llevada a la realidad</p>
        <div style={{ marginTop: 24, textAlign: 'left', fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.8 }}>
          <p style={{ marginBottom: 12 }}>Pulso necesita credenciales de Firebase para funcionar.</p>
          <p style={{ marginBottom: 8 }}>Copiá <code style={{ background: 'var(--bg-tertiary)', padding: '2px 6px', borderRadius: 4 }}>.env.example</code> a <code style={{ background: 'var(--bg-tertiary)', padding: '2px 6px', borderRadius: 4 }}>.env</code> y completá:</p>
          <ul style={{ paddingLeft: 20, margin: 0 }}>
            <li>VITE_FIREBASE_API_KEY</li>
            <li>VITE_FIREBASE_AUTH_DOMAIN</li>
            <li>VITE_FIREBASE_PROJECT_ID</li>
            <li>VITE_FIREBASE_STORAGE_BUCKET</li>
            <li>VITE_FIREBASE_MESSAGING_SENDER_ID</li>
            <li>VITE_FIREBASE_APP_ID</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const { user, loading, login, configured } = useAuth()

  useEffect(() => {
    const el = document.getElementById('splash')
    if (el) {
      const t = setTimeout(() => { el.style.display = 'none' }, 1200)
      return () => clearTimeout(t)
    }
  }, [])

  if (loading) return null

  if (!configured) return <SetupScreen />

  if (!user) {
    return <LoginScreen onLogin={async () => { await login() }} />
  }

  return <AppShell />
}
