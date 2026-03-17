"use client";

import { useState, useMemo } from "react";
import { ChevronRight, Users, Search } from "lucide-react";
import { courses } from "../../courses/mockData";
import { getSessions, getEnrolleesBySession } from "../../course-detail/mockData";
import { orgUsers } from "../../users/mockData";
import { userGroups } from "../../users/groups/mockData";
import {
  useOrgStructureStore,
  findDeptNode,
  type DeptNode,
} from "../../shared/org-structure-store";

type AssignTab = "group" | "org" | "individual";

function DeptTree({
  nodes,
  selected,
  onToggle,
  depth = 0,
}: {
  nodes: DeptNode[];
  selected: Set<string>;
  onToggle: (id: string) => void;
  depth?: number;
}) {
  return (
    <>
      {nodes.map((node) => (
        <div key={node.id}>
          <label
            style={{ paddingLeft: `${depth * 14}px` }}
            className="flex items-center gap-2 py-1 px-2 rounded cursor-pointer hover:bg-slate-50"
          >
            <input
              type="checkbox"
              checked={selected.has(node.id)}
              onChange={() => onToggle(node.id)}
              className="accent-violet-600 w-4 h-4"
            />
            <span className="text-sm text-slate-700">{node.name}</span>
          </label>
          {node.children.length > 0 && (
            <DeptTree
              nodes={node.children}
              selected={selected}
              onToggle={onToggle}
              depth={depth + 1}
            />
          )}
        </div>
      ))}
    </>
  );
}

export default function AssignPanel() {
  const { sites, departments, jobGrades } = useOrgStructureStore();

  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step 1
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);

  // Step 2
  const [tab, setTab] = useState<AssignTab>("group");

  const [selectedGroups, setSelectedGroups] = useState<Set<string>>(new Set());

  const [selectedSites, setSelectedSites] = useState<Set<string>>(new Set());
  const [selectedDepts, setSelectedDepts] = useState<Set<string>>(new Set());
  const [selectedGrades, setSelectedGrades] = useState<Set<string>>(new Set());

  const [search, setSearch] = useState("");
  const [selectedIndividuals, setSelectedIndividuals] = useState<Set<string>>(new Set());

  const publishedCourses = useMemo(
    () => courses.filter((c) => c.status === "PUBLISHED"),
    []
  );
  const sessions = useMemo(
    () => (selectedCourseId ? getSessions(selectedCourseId) : []),
    [selectedCourseId]
  );
  const learners = useMemo(() => orgUsers.filter((u) => u.role === "LEARNER"), []);

  const groupUserIds = useMemo(() => {
    const ids = new Set<string>();
    userGroups
      .filter((g) => selectedGroups.has(g.id))
      .forEach((g) => {
        g.memberIds.forEach((id) => {
          if (learners.some((u) => u.id === id)) ids.add(id);
        });
      });
    return ids;
  }, [selectedGroups, learners]);

  const orgUserIds = useMemo(() => {
    const hasFilter =
      selectedSites.size > 0 || selectedDepts.size > 0 || selectedGrades.size > 0;
    if (!hasFilter) return new Set<string>();
    return new Set(
      learners
        .filter((u) => {
          const siteOk =
            selectedSites.size === 0 ||
            (u.siteId != null && selectedSites.has(u.siteId));
          const deptOk =
            selectedDepts.size === 0 ||
            (u.departmentId != null && selectedDepts.has(u.departmentId));
          const gradeOk =
            selectedGrades.size === 0 ||
            (u.jobGradeId != null && selectedGrades.has(u.jobGradeId));
          return siteOk && deptOk && gradeOk;
        })
        .map((u) => u.id)
    );
  }, [selectedSites, selectedDepts, selectedGrades, learners]);

  const totalSelectedIds = useMemo(
    () => new Set<string>([...groupUserIds, ...orgUserIds, ...selectedIndividuals]),
    [groupUserIds, orgUserIds, selectedIndividuals]
  );

  const enrolledInSession = useMemo(() => {
    if (!selectedSessionId) return new Set<string>();
    return new Set(getEnrolleesBySession(selectedSessionId).map((e) => e.learnerId));
  }, [selectedSessionId]);

  const previewUsers = useMemo(
    () =>
      [...totalSelectedIds].map((id) => ({
        id,
        user: learners.find((u) => u.id === id),
        alreadyEnrolled: enrolledInSession.has(id),
      })),
    [totalSelectedIds, learners, enrolledInSession]
  );

  const newEnrollCount = previewUsers.filter((u) => !u.alreadyEnrolled).length;
  const alreadyCount = previewUsers.filter((u) => u.alreadyEnrolled).length;

  const selectedCourse = publishedCourses.find((c) => c.id === selectedCourseId);
  const selectedSession = sessions.find((s) => s.id === selectedSessionId);

  const orgMatchCount = useMemo(() => orgUserIds.size, [orgUserIds]);

  const filteredLearners = learners.filter(
    (u) => u.name.includes(search) || u.email.includes(search)
  );

  function toggle<T>(set: Set<T>, val: T): Set<T> {
    const next = new Set(set);
    if (next.has(val)) next.delete(val);
    else next.add(val);
    return next;
  }

  const TABS: { key: AssignTab; label: string }[] = [
    { key: "group", label: "그룹" },
    { key: "org", label: "조직" },
    { key: "individual", label: "개인" },
  ];

  const STEPS = [
    { n: 1 as const, label: "과정·차수 선택" },
    { n: 2 as const, label: "배정 대상 선택" },
    { n: 3 as const, label: "배정 미리보기" },
  ];

  return (
    <div className="p-6 max-w-5xl">
      <h1 className="text-xl font-semibold text-slate-800 mb-6">수강 배정</h1>

      {/* Stepper */}
      <div className="flex items-center gap-2 mb-8">
        {STEPS.map(({ n, label }, i) => (
          <div key={n} className="flex items-center gap-2">
            {i > 0 && <ChevronRight size={16} className="text-slate-300" />}
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
                step === n
                  ? "bg-violet-600 text-white"
                  : step > n
                  ? "bg-violet-100 text-violet-700"
                  : "bg-slate-100 text-slate-400"
              }`}
            >
              <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs bg-white/20 font-semibold">
                {step > n ? "✓" : n}
              </span>
              {label}
            </div>
          </div>
        ))}
      </div>

      {/* ── Step 1: 과정·차수 선택 ── */}
      {step === 1 && (
        <div className="grid grid-cols-2 gap-6">
          {/* Course list */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100">
              <p className="text-sm font-medium text-slate-700">과정 선택</p>
            </div>
            <div className="divide-y divide-slate-50">
              {publishedCourses.map((course) => (
                <button
                  key={course.id}
                  onClick={() => {
                    setSelectedCourseId(course.id);
                    setSelectedSessionId(null);
                  }}
                  className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                    selectedCourseId === course.id
                      ? "bg-violet-50 text-violet-700"
                      : "hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <p className="font-medium">{course.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {course.category} · {course.instructor}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Session list */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100">
              <p className="text-sm font-medium text-slate-700">차수 선택</p>
            </div>
            {!selectedCourseId ? (
              <p className="text-sm text-slate-400 p-6 text-center">
                과정을 먼저 선택하세요
              </p>
            ) : (
              <div className="divide-y divide-slate-50">
                {sessions.map((session) => (
                  <button
                    key={session.id}
                    onClick={() => setSelectedSessionId(session.id)}
                    className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                      selectedSessionId === session.id
                        ? "bg-violet-50 text-violet-700"
                        : "hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    <p className="font-medium">{session.name}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {session.enrolled}명 수강 중 · {session.status}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="col-span-2 flex justify-end">
            <button
              onClick={() => setStep(2)}
              disabled={!selectedSessionId}
              className="px-6 py-2 text-sm font-medium text-white bg-violet-600 rounded-lg hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              다음: 배정 대상 선택
            </button>
          </div>
        </div>
      )}

      {/* ── Step 2: 배정 대상 선택 ── */}
      {step === 2 && (
        <div className="grid grid-cols-[1fr_220px] gap-6">
          {/* Main panel */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-slate-200">
              {TABS.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
                    tab === t.key
                      ? "border-violet-600 text-violet-600"
                      : "border-transparent text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="p-4 max-h-[500px] overflow-y-auto">
              {/* 그룹 tab */}
              {tab === "group" && (
                <div className="grid grid-cols-1 gap-3">
                  {userGroups.map((group) => {
                    const isSelected = selectedGroups.has(group.id);
                    const memberLearners = learners.filter((u) =>
                      group.memberIds.includes(u.id)
                    );
                    return (
                      <label
                        key={group.id}
                        className={`flex items-start gap-3 p-4 border rounded-xl cursor-pointer transition-colors ${
                          isSelected
                            ? "border-violet-400 bg-violet-50"
                            : "border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() =>
                            setSelectedGroups((prev) => toggle(prev, group.id))
                          }
                          className="accent-violet-600 w-4 h-4 mt-0.5"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-800">
                            {group.name}
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {group.description}
                          </p>
                          <p className="text-xs text-slate-400 mt-1">
                            <Users size={11} className="inline mr-1" />
                            수강생 {memberLearners.length}명
                          </p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              )}

              {/* 조직 tab */}
              {tab === "org" && (
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      사업장
                    </p>
                    <div className="space-y-0.5">
                      {sites.map((site) => (
                        <label
                          key={site.id}
                          className="flex items-center gap-2 py-1 px-2 rounded cursor-pointer hover:bg-slate-50"
                        >
                          <input
                            type="checkbox"
                            checked={selectedSites.has(site.id)}
                            onChange={() =>
                              setSelectedSites((prev) => toggle(prev, site.id))
                            }
                            className="accent-violet-600 w-4 h-4"
                          />
                          <span className="text-sm text-slate-700">{site.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      부서
                    </p>
                    <DeptTree
                      nodes={departments}
                      selected={selectedDepts}
                      onToggle={(id) =>
                        setSelectedDepts((prev) => toggle(prev, id))
                      }
                    />
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      직급
                    </p>
                    <div className="space-y-0.5">
                      {jobGrades.map((grade) => (
                        <label
                          key={grade.id}
                          className="flex items-center gap-2 py-1 px-2 rounded cursor-pointer hover:bg-slate-50"
                        >
                          <input
                            type="checkbox"
                            checked={selectedGrades.has(grade.id)}
                            onChange={() =>
                              setSelectedGrades((prev) => toggle(prev, grade.id))
                            }
                            className="accent-violet-600 w-4 h-4"
                          />
                          <span className="text-sm text-slate-700">{grade.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {(selectedSites.size > 0 ||
                    selectedDepts.size > 0 ||
                    selectedGrades.size > 0) && (
                    <div className="col-span-3 mt-1 px-3 py-2 bg-violet-50 rounded-lg text-sm text-violet-700">
                      조건에 해당하는 수강생:{" "}
                      <strong>{orgMatchCount}명</strong>
                    </div>
                  )}
                </div>
              )}

              {/* 개인 tab */}
              {tab === "individual" && (
                <div>
                  <div className="relative mb-3">
                    <Search
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type="text"
                      placeholder="이름 또는 이메일 검색"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent"
                    />
                  </div>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-xs text-slate-400 border-b border-slate-100">
                        <th className="py-2 w-8" />
                        <th className="text-left py-2 font-medium">이름</th>
                        <th className="text-left py-2 font-medium">이메일</th>
                        <th className="text-left py-2 font-medium">부서</th>
                        <th className="text-left py-2 font-medium">직급</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredLearners.map((u) => {
                        const isChecked = selectedIndividuals.has(u.id);
                        const deptName = u.departmentId
                          ? (findDeptNode(departments, u.departmentId)?.name ?? "—")
                          : "—";
                        const gradeName = u.jobGradeId
                          ? (jobGrades.find((g) => g.id === u.jobGradeId)?.name ?? "—")
                          : "—";
                        return (
                          <tr
                            key={u.id}
                            onClick={() =>
                              setSelectedIndividuals((prev) => toggle(prev, u.id))
                            }
                            className="border-b border-slate-50 last:border-0 hover:bg-slate-50 cursor-pointer"
                          >
                            <td className="py-2.5 pr-2">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                readOnly
                                className="accent-violet-600 w-4 h-4"
                              />
                            </td>
                            <td className="py-2.5 font-medium text-slate-800">
                              {u.name}
                            </td>
                            <td className="py-2.5 text-slate-500">{u.email}</td>
                            <td className="py-2.5 text-slate-500">{deptName}</td>
                            <td className="py-2.5 text-slate-500">{gradeName}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Right summary */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 h-fit sticky top-4">
            <p className="text-sm font-semibold text-slate-700 mb-3">선택 요약</p>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">그룹</span>
                <span className="font-medium text-slate-700">{groupUserIds.size}명</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">조직 필터</span>
                <span className="font-medium text-slate-700">{orgUserIds.size}명</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">개인</span>
                <span className="font-medium text-slate-700">
                  {selectedIndividuals.size}명
                </span>
              </div>
            </div>
            <div className="border-t border-slate-100 pt-3 mb-4">
              <p className="text-xs text-slate-400 mb-0.5">총 선택 (중복 제거)</p>
              <p className="text-2xl font-bold text-violet-600">
                {totalSelectedIds.size}명
              </p>
            </div>
            <div className="text-xs text-slate-400 bg-slate-50 rounded-lg p-3">
              <p className="font-medium text-slate-500 mb-1 truncate">
                {selectedCourse?.title}
              </p>
              <p className="truncate">{selectedSession?.name}</p>
            </div>
          </div>

          {/* Navigation */}
          <div className="col-span-2 flex justify-between">
            <button
              onClick={() => setStep(1)}
              className="px-5 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              이전
            </button>
            <button
              onClick={() => setStep(3)}
              disabled={totalSelectedIds.size === 0}
              className="px-6 py-2 text-sm font-medium text-white bg-violet-600 rounded-lg hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              다음: 배정 미리보기
            </button>
          </div>
        </div>
      )}

      {/* ── Step 3: 배정 미리보기 ── */}
      {step === 3 && (
        <div>
          {/* Summary bar */}
          <div className="flex items-center gap-6 mb-5 p-4 bg-slate-50 rounded-xl">
            <div className="text-center">
              <p className="text-2xl font-bold text-violet-600">{newEnrollCount}</p>
              <p className="text-xs text-slate-500 mt-0.5">신규 배정 예정</p>
            </div>
            <div className="w-px h-10 bg-slate-200" />
            <div className="text-center">
              <p className="text-2xl font-bold text-slate-400">{alreadyCount}</p>
              <p className="text-xs text-slate-500 mt-0.5">이미 수강 중 (제외)</p>
            </div>
            <div className="ml-auto text-right">
              <p className="text-sm font-medium text-slate-700">
                {selectedCourse?.title}
              </p>
              <p className="text-xs text-slate-400">{selectedSession?.name}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden mb-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-slate-400 bg-slate-50 border-b border-slate-200">
                  <th className="text-left px-4 py-3 font-medium">이름</th>
                  <th className="text-left px-4 py-3 font-medium">이메일</th>
                  <th className="text-left px-4 py-3 font-medium">부서</th>
                  <th className="text-left px-4 py-3 font-medium">직급</th>
                  <th className="text-left px-4 py-3 font-medium">상태</th>
                </tr>
              </thead>
              <tbody>
                {previewUsers.map(({ id, user, alreadyEnrolled }) => {
                  const deptName = user?.departmentId
                    ? (findDeptNode(departments, user.departmentId)?.name ?? "—")
                    : "—";
                  const gradeName = user?.jobGradeId
                    ? (jobGrades.find((g) => g.id === user.jobGradeId)?.name ?? "—")
                    : "—";
                  return (
                    <tr
                      key={id}
                      className={`border-b border-slate-50 last:border-0 ${
                        alreadyEnrolled ? "opacity-50" : ""
                      }`}
                    >
                      <td className="px-4 py-3 font-medium text-slate-800">
                        {user?.name ?? id}
                      </td>
                      <td className="px-4 py-3 text-slate-500">
                        {user?.email ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-slate-500">{deptName}</td>
                      <td className="px-4 py-3 text-slate-500">{gradeName}</td>
                      <td className="px-4 py-3">
                        {alreadyEnrolled ? (
                          <span className="px-2 py-0.5 text-xs font-medium bg-slate-100 text-slate-500 rounded-full">
                            이미 수강 중
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 text-xs font-medium bg-violet-100 text-violet-700 rounded-full">
                            배정 예정
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setStep(2)}
              className="px-5 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              이전
            </button>
            <button
              onClick={() => {
                console.log("배정 실행", {
                  sessionId: selectedSessionId,
                  userIds: [...totalSelectedIds].filter(
                    (id) => !enrolledInSession.has(id)
                  ),
                });
                alert(`${newEnrollCount}명 배정 완료 (시뮬레이션)`);
              }}
              disabled={newEnrollCount === 0}
              className="px-6 py-2 text-sm font-medium text-white bg-violet-600 rounded-lg hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              배정 실행
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
