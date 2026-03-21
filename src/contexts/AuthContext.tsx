import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  admin: AdminUser | null;
  isLoggedIn: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (userId: string): Promise<AdminUser | null> => {
    const { data } = await supabase
      .from('admin_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (!data) return null;
    return { id: data.id, name: data.name, email: data.email, role: data.role };
  }, []);

  // Restore session on mount
  useEffect(() => {
    const restore = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const profile = await fetchProfile(session.user.id);
        if (profile) setAdmin(profile);
      }
      setLoading(false);
    };
    restore();
  }, [fetchProfile]);

  const login = useCallback(async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.user) {
      return { ok: false, error: error?.message || 'Login failed.' };
    }

    const profile = await fetchProfile(data.user.id);
    if (!profile) {
      return { ok: false, error: 'Admin profile not found. Please register first.' };
    }

    setAdmin(profile);
    return { ok: true };
  }, [fetchProfile]);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error || !data.user) {
      if (error?.message?.includes('already registered')) {
        return { ok: false, error: 'This email is already registered.' };
      }
      return { ok: false, error: error?.message || 'Registration failed.' };
    }

    const { error: profileError } = await supabase.from('admin_profiles').insert({
      id: data.user.id,
      name,
      email: email.trim().toLowerCase(),
      role: 'admin',
    });

    if (profileError) {
      return { ok: false, error: profileError.message };
    }

    const profile: AdminUser = { id: data.user.id, name, email, role: 'admin' };
    setAdmin(profile);
    return { ok: true };
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setAdmin(null);
  }, []);

  return (
    <AuthContext.Provider value={{ admin, isLoggedIn: !!admin, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
