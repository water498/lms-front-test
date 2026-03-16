import { create } from 'zustand';
import { categories as initialCategories } from '../courses/mockData';

interface TaxonomyStore {
  categories: string[];
  addCategory: (name: string) => void;
  updateCategory: (oldName: string, newName: string) => void;
  removeCategory: (name: string) => void;
}

export const useTaxonomyStore = create<TaxonomyStore>((set) => ({
  categories: initialCategories,
  addCategory: (name) => set((s) => ({ categories: [...s.categories, name] })),
  updateCategory: (old, next) =>
    set((s) => ({ categories: s.categories.map((c) => (c === old ? next : c)) })),
  removeCategory: (name) =>
    set((s) => ({ categories: s.categories.filter((c) => c !== name) })),
}));
