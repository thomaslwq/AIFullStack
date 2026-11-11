import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type AuthState = {
  token: string | null;
  name: string | null;
  setAuth: (token: string, name: string) => void;
  logout: () => void;
};

/** 登录态：persist 到 localStorage，刷新后保留 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      name: null,
      setAuth: (token, name) => set({ token, name }),
      logout: () => set({ token: null, name: null }),
    }),
    { name: 'aichat-auth' },
  ),
);
