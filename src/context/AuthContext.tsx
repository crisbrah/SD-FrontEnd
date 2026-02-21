import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { authService } from '../lib/api'
import type { GoogleAuthResponse, User } from '../types'

interface AuthContextType {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  loginWithGoogle: (idToken: string) => Promise<GoogleAuthResponse>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

// Decode JWT payload (no verification — solo para leer claims en el cliente)
function decodeToken(token: string): User | null {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return {
      email: payload.sub,
      roles: payload.roles ?? [],
      nombres: payload.nombres,
      miembroId: payload.miembroId,
      personaId: payload.personaId,
    }
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]       = useState<User | null>(null)
  const [token, setToken]     = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Restore session on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    if (storedToken) {
      const decoded = decodeToken(storedToken)
      if (decoded) {
        setToken(storedToken)
        setUser(decoded)
      } else {
        localStorage.clear()
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    const { data } = await authService.signIn(email, password)
    const { token: jwt, refreshToken } = data.data
    localStorage.setItem('token', jwt)
    localStorage.setItem('refreshToken', refreshToken)
    setToken(jwt)
    setUser(decodeToken(jwt))
  }

  const loginWithGoogle = async (idToken: string): Promise<GoogleAuthResponse> => {
    const { data } = await authService.googleLogin(idToken)
    const result: GoogleAuthResponse = data.data

    if (result.status === 'APPROVED' && result.token) {
      localStorage.setItem('token', result.token)
      localStorage.setItem('refreshToken', result.refreshToken ?? '')
      setToken(result.token)
      setUser(decodeToken(result.token))
    }

    return result
  }

  const logout = () => {
    localStorage.clear()
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{ user, token, isAuthenticated: !!token, isLoading, login, loginWithGoogle, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
