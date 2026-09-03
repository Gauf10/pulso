import {
  collection, doc, getDoc, setDoc, updateDoc, deleteDoc,
  query, where, getDocs,
} from 'firebase/firestore'
import { db } from '../lib/firebase'
import type { Task, Subtask, Calendar, GoogleAccount, AISettings, RescheduleHistory } from '../types'

function ensureDb() {
  if (!db) throw new Error('Firebase no está configurado')
  return db
}

function userDoc(userId: string) {
  return doc(ensureDb(), 'users', userId)
}

function tasksCol(userId: string) {
  return collection(ensureDb(), 'users', userId, 'tasks')
}

function subtasksCol(userId: string, taskId: string) {
  return collection(ensureDb(), 'users', userId, 'tasks', taskId, 'subtasks')
}

function historyCol(userId: string, taskId: string) {
  return collection(ensureDb(), 'users', userId, 'tasks', taskId, 'rescheduleHistory')
}

// ── Tasks ──

export async function getTasksForDate(userId: string, date: string): Promise<Task[]> {
  const start = `${date}T00:00:00`
  const end = `${date}T23:59:59`
  const q = query(tasksCol(userId), where('start', '>=', start), where('start', '<=', end))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Task))
}

export async function getAllTasks(userId: string): Promise<Task[]> {
  const snap = await getDocs(tasksCol(userId))
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Task))
}

export async function getTask(userId: string, taskId: string): Promise<Task | null> {
  const snap = await getDoc(doc(tasksCol(userId), taskId))
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as Task) : null
}

export async function saveTask(userId: string, task: Omit<Task, 'id'> & { id?: string }): Promise<string> {
  const id = task.id || doc(tasksCol(userId)).id
  const ref = doc(tasksCol(userId), id)
  await setDoc(ref, { ...task, id, updatedAt: new Date().toISOString() }, { merge: true })
  return id
}

export async function updateTask(userId: string, taskId: string, data: Partial<Task>) {
  await updateDoc(doc(tasksCol(userId), taskId), { ...data, updatedAt: new Date().toISOString() })
}

export async function deleteTask(userId: string, taskId: string) {
  await deleteDoc(doc(tasksCol(userId), taskId))
}

// ── Subtasks ──

export async function getSubtasks(userId: string, taskId: string): Promise<Subtask[]> {
  const snap = await getDocs(subtasksCol(userId, taskId))
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Subtask)).sort((a, b) => a.order - b.order)
}

export async function saveSubtask(userId: string, taskId: string, subtask: Omit<Subtask, 'id'> & { id?: string }) {
  const id = subtask.id || doc(subtasksCol(userId, taskId)).id
  const ref = doc(subtasksCol(userId, taskId), id)
  await setDoc(ref, { ...subtask, id }, { merge: true })
  return id
}

export async function deleteSubtask(userId: string, taskId: string, subtaskId: string) {
  await deleteDoc(doc(subtasksCol(userId, taskId), subtaskId))
}

// ── Reschedule History ──

export async function addReschedule(userId: string, taskId: string, entry: Omit<RescheduleHistory, 'id'>) {
  const id = doc(historyCol(userId, taskId)).id
  await setDoc(doc(historyCol(userId, taskId), id), { ...entry, id })
}

export async function getRescheduleHistory(userId: string, taskId: string): Promise<RescheduleHistory[]> {
  const snap = await getDocs(historyCol(userId, taskId))
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as RescheduleHistory))
}

// ── Calendars ──

export async function getCalendars(userId: string): Promise<Calendar[]> {
  const snap = await getDocs(collection(ensureDb(), 'users', userId, 'calendars'))
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Calendar))
}

export async function saveCalendar(userId: string, calendar: Calendar) {
  await setDoc(doc(ensureDb(), 'users', userId, 'calendars', calendar.id), calendar, { merge: true })
}

// ── Google Accounts ──

export async function getGoogleAccounts(userId: string): Promise<GoogleAccount[]> {
  const snap = await getDocs(collection(ensureDb(), 'users', userId, 'googleAccounts'))
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as GoogleAccount))
}

export async function saveGoogleAccount(userId: string, account: GoogleAccount) {
  await setDoc(doc(ensureDb(), 'users', userId, 'googleAccounts', account.id), account, { merge: true })
}

// ── User Settings ──

export async function getUserSettings(userId: string): Promise<AISettings> {
  const snap = await getDoc(userDoc(userId))
  if (!snap.exists()) return { enabled: false }
  const data = snap.data()
  return { enabled: data.aiEnabled || false }
}

export async function saveUserSettings(userId: string, settings: AISettings) {
  await updateDoc(userDoc(userId), { aiEnabled: settings.enabled })
}

export async function ensureUserDoc(userId: string) {
  const snap = await getDoc(userDoc(userId))
  if (!snap.exists()) {
    await setDoc(userDoc(userId), { createdAt: new Date().toISOString(), aiEnabled: false })
  }
}
