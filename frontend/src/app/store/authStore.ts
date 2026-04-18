import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types';
import { authAPI } from '../services/api';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<User>) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        try {
          const result = await authAPI.login(email, password);
          console.log('success',result.success);
          console.log('data',result);
          if (!result.success) {
            console.log('IMEPITAJE? success');
          }
          if (!result.data) {
            console.log('IMEPITAJE? data'); 
          }
          

          if (!result.success || !result.data) {
            console.log('IMEPITAJE?');
            throw new Error(result.message || 'Invalid credentials');
          }

          const { user, token } = result.data;

          if (!user.isActive) {
            throw new Error('Account is inactive');
          }

          set({ user, token, isAuthenticated: true });
        } catch (error) {
          throw error;
        }
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
      },

      updateUser: async (data: Partial<User>) => {
        const { user } = get();
        if (!user) throw new Error('No user logged in');

        try {
          const result = await authAPI.updateProfile(user.id, data);
          if (result.success && result.data) {
            set({ user: result.data });
          } else {
            throw new Error(result.message || 'Update failed');
          }
        } catch (error) {
          throw error;
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);