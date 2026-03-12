"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import {
  Bell,
  BookOpen,
  Award,
  Clock,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Play,
  Search,
  Star,
  TrendingUp,
  User,
  CheckCircle,
} from "lucide-react";
import {
  heroCourse,
  inProgressCourses,
  recommendedCourses,
  popularCourses,
  categories,
  coursesByCategory,
  userStats,
  announcements,
  type Course,
  type EnrolledCourse,
} from "./mockData";

// ── Navbar ─────────────────────────────────────────────────────────────────

function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const navCategories = ["프론트엔드", "백엔드", "데이터", "AI/ML", "모바일", "디자인", "DevOps"];

  return (
    <nav className="sticky top-0 z-50 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/50">
      <div className="max-w-screen-xl mx-auto px-6 h-16 flex items-center gap-8">
        {/* Logo */}
        <Link href="/experiments/student-home" className="text-xl font-bold text-white shrink-0">
          Open<span className="text-violet-400">Knock</span>
        </Link>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-1">
          <button className="px-3 py-2 text-sm text-zinc-300 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors">
            강의 탐색
          </button>

          {/* Category dropdown */}
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

          <button className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg hover:bg-zinc-800 transition-colors">
            <div className="w-7 h-7 rounded-full bg-violet-600 flex items-center justify-center shrink-0">
              <User className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm text-zinc-300 hidden md:block">홍길동</span>
          </button>
        </div>
      </div>
    </nav>
  );
}

// ── Hero Banner ────────────────────────────────────────────────────────────

function HeroBanner() {
  const course = heroCourse;

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ background: course.thumbnail, minHeight: 400 }}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/90 via-zinc-950/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent" />

      {/* Content */}
      <div className="relative z-10 max-w-screen-xl mx-auto px-6 py-16 md:py-24 flex flex-col gap-4 max-w-xl">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
            {course.categoryLabel}
          </span>
          {course.isBestseller && (
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
              베스트셀러
            </span>
          )}
        </div>

        <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
          {course.title}
        </h2>

        <p className="text-zinc-400 text-sm">
          {course.instructor} 강사 · {course.level} · {course.duration}
        </p>

        <div className="flex items-center gap-1 text-sm">
          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          <span className="text-amber-400 font-semibold">{course.rating}</span>
          <span className="text-zinc-500">({course.reviewCount.toLocaleString()}개 리뷰)</span>
        </div>

        {/* Progress */}
        <div className="flex flex-col gap-1.5 mt-1">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>진행률</span>
            <span className="font-semibold text-white">{course.progress}%</span>
          </div>
          <div className="h-1.5 bg-zinc-700 rounded-full w-64 overflow-hidden">
            <div
              className="h-full bg-violet-500 rounded-full transition-all"
              style={{ width: `${course.progress}%` }}
            />
          </div>
          <p className="text-xs text-zinc-500">다음 강의: {course.nextLessonTitle}</p>
        </div>

        {/* CTA */}
        <div className="flex items-center gap-3 mt-2">
          <button className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm">
            <Play className="w-4 h-4 fill-white" />
            이어서 학습하기
          </button>
          <button className="px-4 py-3 border border-zinc-600 hover:border-zinc-400 text-zinc-300 hover:text-white rounded-xl transition-colors text-sm">
            강의 정보
          </button>
        </div>

        <div className="flex items-center gap-2 mt-1">
          {course.tags.map((tag) => (
            <span key={tag} className="text-xs px-2 py-0.5 rounded bg-zinc-800/80 text-zinc-400">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Course Card ────────────────────────────────────────────────────────────

function CourseCard({ course, showProgress = false }: { course: Course | EnrolledCourse; showProgress?: boolean }) {
  const enrolled = course as EnrolledCourse;
  const progress = showProgress && "progress" in enrolled ? enrolled.progress : null;

  return (
    <div className="w-56 md:w-60 shrink-0 group cursor-pointer">
      {/* Thumbnail */}
      <div
        className="w-full h-36 rounded-xl overflow-hidden mb-3 relative"
        style={{ background: course.thumbnail }}
      >
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity scale-90 group-hover:scale-100">
            <Play className="w-5 h-5 fill-white text-white ml-0.5" />
          </div>
        </div>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex gap-1">
          {course.isNew && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500 text-white">NEW</span>
          )}
          {course.isBestseller && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500 text-white">BEST</span>
          )}
        </div>

        {/* Progress bar */}
        {progress !== null && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-800">
            <div
              className="h-full bg-violet-500 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1">
        <p className="text-sm font-semibold text-white leading-tight line-clamp-2 group-hover:text-violet-300 transition-colors">
          {course.title}
        </p>
        <p className="text-xs text-zinc-500">{course.instructor}</p>

        <div className="flex items-center gap-1 text-xs">
          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          <span className="text-amber-400 font-medium">{course.rating}</span>
          <span className="text-zinc-600">({course.reviewCount >= 1000
            ? `${(course.reviewCount / 1000).toFixed(1)}k`
            : course.reviewCount})</span>
        </div>

        {progress !== null ? (
          <p className="text-xs text-zinc-500">{progress}% 수강 완료</p>
        ) : (
          <p className="text-xs font-semibold text-zinc-300">
            {course.price === 0 ? "무료" : `₩${course.price.toLocaleString()}`}
          </p>
        )}
      </div>
    </div>
  );
}

// ── Scroll Row ─────────────────────────────────────────────────────────────

function ScrollSection({
  title,
  icon,
  courses,
  showProgress = false,
}: {
  title: string;
  icon?: React.ReactNode;
  courses: Course[];
  showProgress?: boolean;
}) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const SCROLL_AMOUNT = 280;

  const updateScrollState = () => {
    const el = rowRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  const scroll = (dir: "left" | "right") => {
    rowRef.current?.scrollBy({
      left: dir === "right" ? SCROLL_AMOUNT : -SCROLL_AMOUNT,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative">
      {/* Section header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {icon && <span className="text-violet-400">{icon}</span>}
          <h3 className="text-lg font-bold text-white">{title}</h3>
        </div>
        <button className="text-sm text-zinc-500 hover:text-violet-400 transition-colors">
          전체 보기 →
        </button>
      </div>

      {/* Scroll buttons */}
      {canScrollLeft && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-12 z-10 -translate-y-1/2 w-10 h-10 rounded-full bg-zinc-800/90 border border-zinc-700 flex items-center justify-center text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors shadow-lg"
          style={{ marginLeft: -20 }}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}
      {canScrollRight && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-12 z-10 -translate-y-1/2 w-10 h-10 rounded-full bg-zinc-800/90 border border-zinc-700 flex items-center justify-center text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors shadow-lg"
          style={{ marginRight: -20 }}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}

      {/* Scroll container */}
      <div
        ref={rowRef}
        onScroll={updateScrollState}
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 snap-x snap-mandatory"
      >
        {courses.map((course) => (
          <div key={course.id} className="snap-start">
            <CourseCard course={course} showProgress={showProgress} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Category Section ───────────────────────────────────────────────────────

function CategorySection() {
  const [activeCategory, setActiveCategory] = useState("all");
  const courses = coursesByCategory[activeCategory] ?? [];

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="w-5 h-5 text-violet-400" />
        <h3 className="text-lg font-bold text-white">카테고리별 추천</h3>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide pb-1">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeCategory === cat.id
                ? "bg-violet-600 text-white"
                : "bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {courses.length > 0 ? (
        <ScrollSection title="" courses={courses} />
      ) : (
        <p className="text-zinc-600 text-sm py-8 text-center">해당 카테고리 강의가 없습니다.</p>
      )}
    </div>
  );
}

// ── Stats Widget ───────────────────────────────────────────────────────────

function StatsWidget() {
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

// ── Announcement Grid ──────────────────────────────────────────────────────

const ANNOUNCEMENT_TYPE_STYLES: Record<string, string> = {
  "공지":     "bg-zinc-700/50 text-zinc-300",
  "이벤트":   "bg-rose-900/40 text-rose-300",
  "업데이트": "bg-sky-900/40 text-sky-300",
};

function AnnouncementGrid() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white">공지 · 이벤트</h3>
        <button className="text-sm text-zinc-500 hover:text-violet-400 transition-colors">전체 보기 →</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {announcements.map((ann) => (
          <div
            key={ann.id}
            className="flex items-start gap-3 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl px-4 py-3.5 cursor-pointer transition-colors group"
          >
            <span
              className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded mt-0.5 ${
                ANNOUNCEMENT_TYPE_STYLES[ann.type]
              }`}
            >
              {ann.type}
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm text-zinc-200 group-hover:text-white transition-colors truncate">
                  {ann.title}
                </p>
                {ann.isNew && (
                  <span className="shrink-0 text-[10px] font-bold text-violet-400">NEW</span>
                )}
              </div>
              <p className="text-xs text-zinc-600 mt-1">{ann.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Footer ─────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="border-t border-zinc-800/50 mt-16">
      <div className="max-w-screen-xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row md:items-start gap-8 justify-between">
          <div>
            <p className="text-lg font-bold text-white mb-2">
              Open<span className="text-violet-400">Knock</span>
            </p>
            <p className="text-xs text-zinc-600 max-w-xs leading-relaxed">
              LMS 플랫폼 개발 전 UI/UX 프로토타입 실험 페이지입니다.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-sm">
            <div className="flex flex-col gap-2">
              <p className="text-zinc-400 font-medium mb-1">서비스</p>
              {["강의 탐색", "로드맵", "수료증", "기업 교육"].map((t) => (
                <button key={t} className="text-zinc-600 hover:text-zinc-400 text-left transition-colors">{t}</button>
              ))}
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-zinc-400 font-medium mb-1">지원</p>
              {["고객센터", "FAQ", "공지사항", "이벤트"].map((t) => (
                <button key={t} className="text-zinc-600 hover:text-zinc-400 text-left transition-colors">{t}</button>
              ))}
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-zinc-400 font-medium mb-1">약관</p>
              {["이용약관", "개인정보처리방침", "운영정책"].map((t) => (
                <button key={t} className="text-zinc-600 hover:text-zinc-400 text-left transition-colors">{t}</button>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-zinc-800/50 mt-8 pt-6 flex items-center justify-between">
          <p className="text-xs text-zinc-700">© 2026 OpenKnock. LMS Front Test Prototype.</p>
          <Link href="/" className="text-xs text-zinc-700 hover:text-zinc-500 transition-colors">
            ← 실험 목록으로
          </Link>
        </div>
      </div>
    </footer>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────

export default function StudentHomePage() {
  return (
    <div className="bg-zinc-950 text-white min-h-screen">
      <Navbar />
      <HeroBanner />

      <div className="max-w-screen-xl mx-auto px-6 py-12 flex flex-col gap-14">
        {/* 이어서 학습하기 */}
        {inProgressCourses.length > 0 && (
          <ScrollSection
            title="이어서 학습하기"
            icon={<Play className="w-5 h-5 fill-current" />}
            courses={inProgressCourses}
            showProgress
          />
        )}

        {/* 추천 강의 */}
        <ScrollSection
          title="추천 강의"
          icon={<Star className="w-5 h-5 fill-current" />}
          courses={recommendedCourses}
        />

        {/* 지금 인기있는 강의 */}
        <ScrollSection
          title="지금 인기있는 강의"
          icon={<TrendingUp className="w-5 h-5" />}
          courses={popularCourses}
        />

        {/* 카테고리별 추천 */}
        <CategorySection />

        {/* 내 학습 현황 */}
        <StatsWidget />

        {/* 공지/이벤트 */}
        <AnnouncementGrid />
      </div>

      <Footer />
    </div>
  );
}
