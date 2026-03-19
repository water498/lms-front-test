import { create } from 'zustand';
import { users as initialUsers, type User } from '../users/mockData';

interface UsersStore {
  users: User[];
  addUser: (user: User) => void;
  updateUser: (id: string, patch: Partial<User>) => void;
  removeUser: (id: string) => void;
}

export const useUsersStore = create<UsersStore>((set) => ({
  users: initialUsers,
  addUser: (user) => set((s) => ({ users: [...s.users, user] })),
  updateUser: (id, patch) =>
    set((s) => ({ users: s.users.map((u) => (u.id === id ? { ...u, ...patch } : u)) })),
  removeUser: (id) =>
    set((s) => ({ users: s.users.filter((u) => u.id !== id) })),
}));
