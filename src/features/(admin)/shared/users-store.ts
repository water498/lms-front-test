import { create } from 'zustand';
import { orgUsers, type OrgUser } from '../users/mockData';

interface UsersStore {
  users: OrgUser[];
  addUser: (user: OrgUser) => void;
  updateUser: (id: string, patch: Partial<OrgUser>) => void;
  removeUser: (id: string) => void;
}

export const useUsersStore = create<UsersStore>((set) => ({
  users: orgUsers,
  addUser: (user) => set((s) => ({ users: [...s.users, user] })),
  updateUser: (id, patch) =>
    set((s) => ({ users: s.users.map((u) => (u.id === id ? { ...u, ...patch } : u)) })),
  removeUser: (id) =>
    set((s) => ({ users: s.users.filter((u) => u.id !== id) })),
}));
