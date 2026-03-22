import React, { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { getProfile, getCachedProfile, setCachedProfile, clearCachedProfile } from '@/services/userService';

const TOKEN_KEY = 'auth_token';

interface AuthContextValue {
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  userType: number[] | null;
  isDriver: boolean;
  signIn: (token: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  token: null,
  isLoading: true,
  isAuthenticated: false,
  userType: null,
  isDriver: false,
  signIn: async () => {},
  signOut: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userType, setUserType] = useState<number[] | null>(null);

  // Restore token + userType from SecureStore on mount
  useEffect(() => {
    (async () => {
      try {
        const stored = await SecureStore.getItemAsync(TOKEN_KEY);
        if (stored) {
          setToken(stored);
          // Read cached profile for userType
          const cached = await getCachedProfile();
          if (cached) setUserType(cached.userType);
        }
      } catch {
        // Ignore read errors
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const signIn = async (newToken: string) => {
    await SecureStore.setItemAsync(TOKEN_KEY, newToken);
    setToken(newToken);

    // Cache profile on login
    try {
      const res = await getProfile(newToken);
      if (res.data) {
        await setCachedProfile(res.data);
        setUserType(res.data.userType);
      }
    } catch {}
  };

  const signOut = async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await clearCachedProfile();
    setToken(null);
    setUserType(null);
  };

  const isDriver = userType?.includes(3) ?? false;

  return (
    <AuthContext.Provider
      value={{
        token,
        isLoading,
        isAuthenticated: !!token,
        userType,
        isDriver,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
