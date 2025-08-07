import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/services/supabaseClient';

export interface AuthUser {
  id: string;
  email: string;
  role: string; // 'admin' | 'user' | etc
}

interface AuthContextProps {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error?: string; user?: AuthUser | null }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);


  // Helper para obtener el rol desde la tabla de perfiles
  const fetchUserRole = async (userId: string): Promise<string> => {
    try {
      const cleanId = (userId || '').trim();
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', cleanId);
      console.log('[Auth] fetchUserRole for', cleanId, '=>', data, error);
      if (error) {
        console.warn('Error fetching user role:', error.message);
        return 'user';
      }
      if (!data || !Array.isArray(data) || data.length === 0) return 'user';
      if (!data[0].role) return 'user';
      return data[0].role;
    } catch (e) {
      console.warn('Exception fetching user role:', e);
      return 'user';
    }
  };

  // Refresca el usuario y su rol desde Supabase
  const refreshUser = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        // UID puede estar en session.user.id o en session.user.user_metadata.sub
        const userId = session.user.id || session.user.user_metadata?.sub;
        const email = session.user.email ?? '';
        const role = await fetchUserRole(userId);
        console.log('[Auth] refreshUser', { userId, email, role });
        setUser({
          id: userId,
          email,
          role,
        });
      } else {
        setUser(null);
      }
    } catch (e) {
      setUser(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    refreshUser();
    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      refreshUser();
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  // Login y refresco de usuario/rol
  const login = async (email: string, password: string) => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    await refreshUser();
    setLoading(false);
    if (error) return { error: error.message, user: null };
    return { error: undefined, user };
  };

  // Logout y limpieza de usuario
  const logout = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setUser(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
