"use client";

import { Award, CheckCircle, Clock, Play, TrendingUp } from "lucide-react";
import { userStats } from "../mockData";

export function StatsWidget() {
  const stats = userStats;
  const hours = Math.floor(stats.totalLearningMinutes / 60);
  const mins = stats.totalLearningMinutes % 60;

  const items = [
    {
      icon: <CheckCircle className="w-6 h-6" />,
      label: "완료한 강의",
      value: `${stats.completedCourses}개`,
      color: "text-emerald-400",
      bg: "bg-emerald-400/10",
    },
    {
      icon: <Play className="w-6 h-6 fill-current" />,
      label: "진행 중인 강의",
      value: `${stats.inProgressCourses}개`,
      color: "text-violet-400",
      bg: "bg-violet-400/10",
    },
    {
      icon: <Clock className="w-6 h-6" />,
      label: "총 수강 시간",
      value: `${hours}시간 ${mins}분`,
      color: "text-sky-400",
      bg: "bg-sky-400/10",
    },
    {
      icon: <Award className="w-6 h-6" />,
      label: "수료증",
      value: `${stats.certificates}개`,
      color: "text-amber-400",
      bg: "bg-amber-400/10",
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-violet-400" />
        <h3 className="text-lg font-bold text-white">내 학습 현황</h3>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((item) => (
          <div
            key={item.label}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col gap-3"
          >
            <div className={`w-10 h-10 rounded-xl ${item.bg} ${item.color} flex items-center justify-center`}>
              {item.icon}
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{item.value}</p>
              <p className="text-xs text-zinc-500 mt-0.5">{item.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
