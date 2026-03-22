import React, { createContext, useContext, useState } from 'react';

// NOTE: For production (EAS build), replace this with expo-secure-store
// for encrypted token persistence between app restarts.
// In Expo Go dev mode, the token lives in memory only.

const TOKEN_KEY = 'auth_token';

interface AuthContextValue {
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (token: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  token: null,
  isLoading: false,
  isAuthenticated: false,
  signIn: async () => {},
  signOut: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);

  const signIn = async (newToken: string) => {
    setToken(newToken);
  };

  const signOut = async () => {
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        isLoading: false,
        isAuthenticated: !!token,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
