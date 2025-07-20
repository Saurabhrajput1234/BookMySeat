import { createContext, useState, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';
import type { ReactNode } from 'react';

interface DecodedToken {
  name?: string;
  email?: string;
  exp: number;
  [key: string]: any; // handle dynamic keys like role claim
}

interface User {
  name?: string;
  email?: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));

  const getUserFromToken = (t: string | null): User | null => {
    if (!t) return null;
    const decoded: DecodedToken = jwtDecode(t);
    const role = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || 'User';
    return {
      name: decoded.name || '',
      email: decoded.email || '',
      role,
    };
  };

  const [user, setUser] = useState<User | null>(() => getUserFromToken(token));

  const login = (newToken: string) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(getUserFromToken(newToken));
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
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
