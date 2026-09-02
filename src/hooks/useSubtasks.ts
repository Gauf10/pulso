import { useState, useCallback, useEffect } from 'react'
import type { User } from 'firebase/auth'
import type { Subtask } from '../types'
import * as fs from '../services/firestoreService'

export function useSubtasks(user: User | null, taskId: string | null) {
  const [subtasks, setSubtasks] = useState<Subtask[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!user || !taskId) {
      setSubtasks([])
      return
    }
    setLoading(true)
    fs.getSubtasks(user.uid, taskId)
      .then(setSubtasks)
      .finally(() => setLoading(false))
  }, [user, taskId])

  const addSubtask = useCallback(async (title: string) => {
    if (!user || !taskId) return
    const subtask: Omit<Subtask, 'id'> = {
      taskId,
      title,
      completed: false,
      order: subtasks.length,
      estimatedDurationMinutes: 0,
      actualDurationMinutes: 0,
    }
    const id = await fs.saveSubtask(user.uid, taskId, subtask)
    setSubtasks(prev => [...prev, { ...subtask, id }])
    return id
  }, [user, taskId, subtasks.length])

  const toggleSubtask = useCallback(async (subtaskId: string) => {
    if (!user || !taskId) return
    const st = subtasks.find(s => s.id === subtaskId)
    if (!st) return
    const updated = { completed: !st.completed }
    await fs.saveSubtask(user.uid, taskId, { ...st, ...updated })
    setSubtasks(prev => prev.map(s => s.id === subtaskId ? { ...s, ...updated } : s))
  }, [user, taskId, subtasks])

  const deleteSubtask = useCallback(async (subtaskId: string) => {
    if (!user || !taskId) return
    await fs.deleteSubtask(user.uid, taskId, subtaskId)
    setSubtasks(prev => prev.filter(s => s.id !== subtaskId))
  }, [user, taskId])

  const updateSubtask = useCallback(async (subtaskId: string, data: Partial<Subtask>) => {
    if (!user || !taskId) return
    const st = subtasks.find(s => s.id === subtaskId)
    if (!st) return
    await fs.saveSubtask(user.uid, taskId, { ...st, ...data })
    setSubtasks(prev => prev.map(s => s.id === subtaskId ? { ...s, ...data } : s))
  }, [user, taskId, subtasks])

  return { subtasks, loading, addSubtask, toggleSubtask, deleteSubtask, updateSubtask }
}
