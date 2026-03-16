import { create } from 'zustand';

interface OrgStructureStore {
  departments: string[];
  jobGrades: string[];
  addDepartment: (name: string) => void;
  updateDepartment: (oldName: string, newName: string) => void;
  removeDepartment: (name: string) => void;
  addJobGrade: (name: string) => void;
  updateJobGrade: (oldName: string, newName: string) => void;
  removeJobGrade: (name: string) => void;
}

export const useOrgStructureStore = create<OrgStructureStore>((set) => ({
  departments: ["개발팀", "디자인팀", "기획팀"],
  jobGrades: ["사원", "대리", "과장", "부장"],
  addDepartment: (name) => set((s) => ({ departments: [...s.departments, name] })),
  updateDepartment: (old, next) =>
    set((s) => ({ departments: s.departments.map((d) => (d === old ? next : d)) })),
  removeDepartment: (name) =>
    set((s) => ({ departments: s.departments.filter((d) => d !== name) })),
  addJobGrade: (name) => set((s) => ({ jobGrades: [...s.jobGrades, name] })),
  updateJobGrade: (old, next) =>
    set((s) => ({ jobGrades: s.jobGrades.map((g) => (g === old ? next : g)) })),
  removeJobGrade: (name) =>
    set((s) => ({ jobGrades: s.jobGrades.filter((g) => g !== name) })),
}));
