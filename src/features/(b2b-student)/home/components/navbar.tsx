"use client";

import { useState } from "react";
import Link from "next/link";
import { Bell, ChevronDown, Search, User } from "lucide-react";
import { TENANT_NAME } from "../mockData";

export function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const navCategories = ["프론트엔드", "백엔드", "데이터", "AI/ML", "모바일", "디자인", "DevOps"];

  return (
    <nav className="sticky top-0 z-50 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/50">
      <div className="max-w-screen-xl mx-auto px-6 h-16 flex items-center gap-8">
        {/* Logo */}
        <Link href="/experiments/b2b-student" className="text-xl font-bold text-white shrink-0">
          Open<span className="text-violet-400">Knock</span>
          <span className="text-sm font-normal text-zinc-400 ml-2">| {TENANT_NAME}</span>
        </Link>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-1">
          <button className="px-3 py-2 text-sm text-zinc-300 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors">
            강의 탐색
          </button>

          <div
            className="relative"
            onMouseEnter={() => setCategoryOpen(true)}
            onMouseLeave={() => setCategoryOpen(false)}
          >
            <button className="flex items-center gap-1 px-3 py-2 text-sm text-zinc-300 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors">
              카테고리
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
            {categoryOpen && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-zinc-900 border border-zinc-700/60 rounded-xl shadow-xl shadow-black/40 py-1 z-50">
                {navCategories.map((cat) => (
                  <button
                    key={cat}
                    className="block w-full text-left px-4 py-2.5 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button className="px-3 py-2 text-sm text-zinc-300 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors">
            로드맵
          </button>
        </div>

        {/* Right side */}
        <div className="ml-auto flex items-center gap-2">
          {/* Search */}
          <div className="flex items-center">
            {searchOpen ? (
              <div className="flex items-center bg-zinc-800 border border-zinc-700 rounded-lg overflow-hidden">
                <Search className="w-4 h-4 text-zinc-500 ml-3 shrink-0" />
                <input
                  autoFocus
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onBlur={() => { if (!searchValue) setSearchOpen(false); }}
                  placeholder="강의 검색..."
                  className="bg-transparent px-2 py-2 text-sm text-white placeholder-zinc-600 w-48 focus:outline-none"
                />
              </div>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>
            )}
          </div>

          <button className="relative p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-violet-400 rounded-full" />
          </button>

          {/* My page — department + name */}
          <Link
            href="/experiments/b2b-student/my"
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-violet-600 flex items-center justify-center shrink-0">
              <User className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm text-zinc-300 hidden md:block">개발팀 · 홍길동</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
