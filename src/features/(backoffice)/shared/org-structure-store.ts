import { create } from 'zustand';
import type { OrgPositionRoleType } from '@/lib/models';

export interface Site {
  id: string;
  name: string;
}

export interface JobGrade {
  id: string;
  name: string;
  roleType: OrgPositionRoleType;
}

export interface DeptNode {
  id: string;
  name: string;
  siteId?: string;    // 루트 노드에만 설정. children은 부모 siteId 상속
  parentId?: string;  // OrgTeam.parentId 대응. 루트 노드는 undefined
  children: DeptNode[];
}

// ── tree helpers ──────────────────────────────────────────────────────────────

function addChild(tree: DeptNode[], parentId: string, node: DeptNode): DeptNode[] {
  return tree.map((d) =>
    d.id === parentId
      ? { ...d, children: [...d.children, node] }
      : { ...d, children: addChild(d.children, parentId, node) }
  );
}

function updateNode(tree: DeptNode[], id: string, name: string): DeptNode[] {
  return tree.map((d) =>
    d.id === id
      ? { ...d, name }
      : { ...d, children: updateNode(d.children, id, name) }
  );
}

function removeNode(tree: DeptNode[], id: string): DeptNode[] {
  return tree
    .filter((d) => d.id !== id)
    .map((d) => ({ ...d, children: removeNode(d.children, id) }));
}

/** Returns all dept IDs in a subtree (inclusive). Used for member-count on delete. */
export function flatDeptIds(nodes: DeptNode[]): string[] {
  return nodes.flatMap((n) => [n.id, ...flatDeptIds(n.children)]);
}

/** Find a single node by id and return it (or undefined). */
export function findDeptNode(nodes: DeptNode[], id: string): DeptNode | undefined {
  for (const n of nodes) {
    if (n.id === id) return n;
    const found = findDeptNode(n.children, id);
    if (found) return found;
  }
  return undefined;
}

let _nextDeptId = 10;
function genDeptId() { return `dept-${_nextDeptId++}`; }

let _nextSiteId = 3;
function genSiteId() { return `site-${_nextSiteId++}`; }

let _nextGradeId = 5;
function genGradeId() { return `grade-${_nextGradeId++}`; }

// ── store ─────────────────────────────────────────────────────────────────────

interface OrgStructureStore {
  departments: DeptNode[];
  addRootDept: (name: string, siteId?: string) => void;
  addChildDept: (parentId: string, name: string) => void;
  updateDept: (id: string, name: string) => void;
  removeDept: (id: string) => void;

  jobGrades: JobGrade[];
  addJobGrade: (name: string, roleType: OrgPositionRoleType) => void;
  updateJobGrade: (id: string, name: string, roleType: OrgPositionRoleType) => void;
  removeJobGrade: (id: string) => void;

  sites: Site[];
  addSite: (name: string) => void;
  updateSite: (id: string, name: string) => void;
  removeSite: (id: string) => void;
}

const initialDepts: DeptNode[] = [
  {
    id: 'dept-1',
    name: '개발본부',
    siteId: 'site-1',
    children: [
      { id: 'dept-2', name: '백엔드팀', children: [] },
      { id: 'dept-3', name: '프론트엔드팀', children: [] },
    ],
  },
  {
    id: 'dept-4',
    name: '마케팅본부',
    siteId: 'site-1',
    children: [
      { id: 'dept-5', name: '콘텐츠팀', children: [] },
    ],
  },
  { id: 'dept-6', name: '기획팀', siteId: 'site-2', children: [] },
  { id: 'dept-7', name: '디자인팀', children: [] },  // 전사 공통
];

const initialJobGrades: JobGrade[] = [
  { id: 'grade-1', name: '사원', roleType: 'MEMBER' },
  { id: 'grade-2', name: '대리', roleType: 'MEMBER' },
  { id: 'grade-3', name: '과장', roleType: 'LEADER' },
  { id: 'grade-4', name: '부장', roleType: 'EXECUTIVE' },
];

const initialSites: Site[] = [
  { id: 'site-1', name: '서울 본사' },
  { id: 'site-2', name: '부산 지점' },
];

export const useOrgStructureStore = create<OrgStructureStore>((set) => ({
  departments: initialDepts,
  addRootDept: (name, siteId) =>
    set((s) => ({
      departments: [...s.departments, { id: genDeptId(), name, siteId, children: [] }],
    })),
  addChildDept: (parentId, name) =>
    set((s) => ({
      departments: addChild(s.departments, parentId, { id: genDeptId(), name, children: [] }),
    })),
  updateDept: (id, name) =>
    set((s) => ({ departments: updateNode(s.departments, id, name) })),
  removeDept: (id) =>
    set((s) => ({ departments: removeNode(s.departments, id) })),

  jobGrades: initialJobGrades,
  addJobGrade: (name, roleType) =>
    set((s) => ({ jobGrades: [...s.jobGrades, { id: genGradeId(), name, roleType }] })),
  updateJobGrade: (id, name, roleType) =>
    set((s) => ({ jobGrades: s.jobGrades.map((g) => (g.id === id ? { ...g, name, roleType } : g)) })),
  removeJobGrade: (id) =>
    set((s) => ({ jobGrades: s.jobGrades.filter((g) => g.id !== id) })),

  sites: initialSites,
  addSite: (name) =>
    set((s) => ({ sites: [...s.sites, { id: genSiteId(), name }] })),
  updateSite: (id, name) =>
    set((s) => ({ sites: s.sites.map((site) => (site.id === id ? { ...site, name } : site)) })),
  removeSite: (id) =>
    set((s) => ({
      sites: s.sites.filter((site) => site.id !== id),
      // 해당 사업장 소속 루트 부서도 함께 제거
      departments: s.departments.filter((d) => d.siteId !== id),
    })),
}));
