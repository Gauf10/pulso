import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  type User,
} from 'firebase/auth'
import { auth, googleProvider, isConfigured } from './firebase'

export function onAuthChange(cb: (user: User | null) => void): () => void {
  if (!auth) return () => {}
  return onAuthStateChanged(auth, cb)
}

export async function loginWithGoogle(): Promise<{ user: User; accessToken: string }> {
  if (!auth || !googleProvider) throw new Error('Firebase no está configurado')
  const result = await signInWithPopup(auth, googleProvider)
  const credential = GoogleAuthProvider.credentialFromResult(result)
  const accessToken = credential?.accessToken || ''
  return { user: result.user, accessToken }
}

export async function logout(): Promise<void> {
  if (!auth) return
  await signOut(auth)
}

export function userKey(user: User): string {
  return user.email ? user.email.trim().toLowerCase() : user.uid
}
