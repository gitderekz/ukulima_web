import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types';
import { db } from '../db/database';

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
        const user = await db.users.findByEmail(email);

        if (!user || user.password !== password) {
          throw new Error('Invalid credentials');
        }

        if (!user.isActive) {
          throw new Error('Account is inactive');
        }

        // Generate mock JWT token
        const token = `jwt_${user.id}_${Date.now()}`;

        // Create audit log
        await db.auditLogs.create({
          userId: user.id,
          action: 'LOGIN',
          entityType: 'user',
          entityId: user.id,
          details: `User ${user.email} logged in`,
          ipAddress: '127.0.0.1',
        });

        set({ user, token, isAuthenticated: true });
      },

      logout: () => {
        const { user } = get();
        if (user) {
          db.auditLogs.create({
            userId: user.id,
            action: 'LOGOUT',
            entityType: 'user',
            entityId: user.id,
            details: `User ${user.email} logged out`,
            ipAddress: '127.0.0.1',
          });
        }
        set({ user: null, token: null, isAuthenticated: false });
      },

      updateUser: async (data: Partial<User>) => {
        const { user } = get();
        if (!user) throw new Error('No user logged in');

        const updated = await db.users.update(user.id, data);
        set({ user: updated });
      },
    }),
    {
      name: 'ukulima-auth',
    }
  )
);
