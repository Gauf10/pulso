import { useState, useEffect, useCallback } from 'react'
import type { User } from 'firebase/auth'
import { onAuthChange, loginWithGoogle, logout as fbLogout } from '../lib/auth'
import { isConfigured } from '../lib/firebase'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [accessToken, setAccessToken] = useState<string>(() => localStorage.getItem('pulso_token') || '')

  useEffect(() => {
    if (!isConfigured) {
      setLoading(false)
      return
    }
    const unsub = onAuthChange((u) => {
      setUser(u)
      setLoading(false)
    })
    return unsub
  }, [])

  const handleSetToken = useCallback((token: string) => {
    if (token) localStorage.setItem('pulso_token', token)
    else localStorage.removeItem('pulso_token')
    setAccessToken(token)
  }, [])

  const login = useCallback(async () => {
    const result = await loginWithGoogle()
    handleSetToken(result.accessToken)
    return result
  }, [handleSetToken])

  const logout = useCallback(async () => {
    await fbLogout()
    handleSetToken('')
  }, [handleSetToken])

  return { user, loading, login, logout, accessToken, setAccessToken: handleSetToken, configured: isConfigured }
}
