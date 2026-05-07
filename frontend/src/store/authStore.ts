import { create } from 'zustand';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  token: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: (userData) => {
    localStorage.setItem('token', userData.token);
    set({ user: userData, isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, isAuthenticated: false });
  },
}));
