import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User, AuthContextType } from '../types';
import client from '../api/client';

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount: restore session from localStorage by verifying the stored token with /api/me.
  // This ensures the user object is always populated after a hard refresh, and stale
  // tokens are cleared silently instead of leaving the user stuck in a broken state.
  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token');
    if (!storedToken) {
      setIsLoading(false);
      return;
    }
    client
      .get<User>('/me')
      .then((res) => {
        setUser(res.data);
        setToken(storedToken);
      })
      .catch(() => {
        // Token is invalid or expired — clear it silently
        localStorage.removeItem('auth_token');
      })
      .finally(() => setIsLoading(false));
  }, []);

  function login(newUser: User, newToken: string) {
    setUser(newUser);
    setToken(newToken);
    localStorage.setItem('auth_token', newToken);
  }

  function logout() {
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth_token');
  }

  async function refreshUser(): Promise<void> {
    const res = await client.get<User>('/me');
    setUser(res.data);
  }

  return (
    <AuthContext.Provider
      value={{ user, token, isAuthenticated: !!token, isLoading, login, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
