import { createContext, useState, useContext } from 'react';
import type { ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode'; // ✅ Corrected import

interface AuthContextType {
  user: any;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [user, setUser] = useState<any>(() => {
    const t = localStorage.getItem('token');
    return t ? jwtDecode(t) : null;
  });

  const login = (newToken: string) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
    setUser(jwtDecode(newToken));
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
