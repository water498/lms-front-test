import { create } from 'zustand';
import { categories as initialCategoryNames } from '../courses/mockData';

export interface Category {
  id: string;
  name: string;
  parentId: string | null; // null = top-level
  order: number;
}

interface TaxonomyStore {
  categories: Category[];
  addCategory: (name: string, parentId?: string | null) => void;
  updateCategory: (id: string, name: string) => void;
  removeCategory: (id: string) => void;
  moveCategory: (id: string, direction: "up" | "down") => void;
}

const initialCategories: Category[] = initialCategoryNames.map((name, i) => ({
  id: `cat-${i + 1}`,
  name,
  parentId: null,
  order: i,
}));

let _nextId = initialCategories.length + 1;
function nextId() { return `cat-${_nextId++}`; }

export const useTaxonomyStore = create<TaxonomyStore>((set) => ({
  categories: initialCategories,

  addCategory: (name, parentId = null) =>
    set((s) => {
      const siblings = s.categories.filter((c) => c.parentId === parentId);
      return {
        categories: [
          ...s.categories,
          { id: nextId(), name, parentId: parentId ?? null, order: siblings.length },
        ],
      };
    }),

  updateCategory: (id, name) =>
    set((s) => ({
      categories: s.categories.map((c) => (c.id === id ? { ...c, name } : c)),
    })),

  removeCategory: (id) =>
    set((s) => {
      // Collect all descendant IDs recursively
      const toRemove = new Set<string>([id]);
      let changed = true;
      while (changed) {
        changed = false;
        for (const c of s.categories) {
          if (c.parentId && toRemove.has(c.parentId) && !toRemove.has(c.id)) {
            toRemove.add(c.id);
            changed = true;
          }
        }
      }
      return { categories: s.categories.filter((c) => !toRemove.has(c.id)) };
    }),

  moveCategory: (id, direction) =>
    set((s) => {
      const cat = s.categories.find((c) => c.id === id);
      if (!cat) return s;
      const siblings = s.categories
        .filter((c) => c.parentId === cat.parentId)
        .sort((a, b) => a.order - b.order);
      const idx = siblings.findIndex((c) => c.id === id);
      const swapIdx = direction === "up" ? idx - 1 : idx + 1;
      if (swapIdx < 0 || swapIdx >= siblings.length) return s;
      const swapId = siblings[swapIdx].id;
      const swapOrder = siblings[swapIdx].order;
      return {
        categories: s.categories.map((c) => {
          if (c.id === id) return { ...c, order: swapOrder };
          if (c.id === swapId) return { ...c, order: cat.order };
          return c;
        }),
      };
    }),
}));
