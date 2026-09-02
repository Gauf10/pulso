import { useState, useEffect, useCallback } from 'react'
import type { User } from 'firebase/auth'
import { onAuthChange, loginWithGoogle, logout as fbLogout } from '../lib/auth'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [accessToken, setAccessToken] = useState<string>('')

  useEffect(() => {
    const unsub = onAuthChange((u) => {
      setUser(u)
      setLoading(false)
    })
    return unsub
  }, [])

  const login = useCallback(async () => {
    const result = await loginWithGoogle()
    setAccessToken(result.accessToken)
    return result
  }, [])

  const logout = useCallback(async () => {
    await fbLogout()
    setAccessToken('')
  }, [])

  return { user, loading, login, logout, accessToken, setAccessToken }
}
