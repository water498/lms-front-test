"use client";

import { useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Search,
  Bell,
  ShoppingCart,
  User,
  Star,
  MapPin,
  Calendar,
  Users,
  Heart,
  SlidersHorizontal,
  X,
  ChevronDown,
  ChevronUp,
  Play,
} from "lucide-react";
import { allCourses, type Course } from "../student-dashboard/mockData";
import { TYPE_BADGE } from "../student-dashboard/components/course-card";
import store from "../student-dashboard/store";
import { type CourseType } from "@/lib/models";

// ── Navbar ─────────────────────────────────────────────────────────────────

function Navbar({ cartCount }: { cartCount: number }) {
  return (
    <nav className="sticky top-0 z-50 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/50">
      <div className="max-w-screen-xl mx-auto px-6 h-16 flex items-center gap-4">
        <Link href="/student" className="text-xl font-bold text-white shrink-0">
          Open<span className="text-violet-400">Knock</span>
        </Link>
        <div className="ml-auto flex items-center gap-2">
          <button className="relative p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-violet-400 rounded-full" />
          </button>
          <Link href="/student/cart" className="relative p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors">
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-violet-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
                {cartCount}
              </span>
            )}
          </Link>
          <Link href="/student/my" className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg hover:bg-zinc-800 transition-colors">
            <div className="w-7 h-7 rounded-full bg-violet-600 flex items-center justify-center shrink-0">
              <User className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm text-zinc-300 hidden md:block">홍길동</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}

// ── Types & constants ────────────────────────────────────────────────────────

type SortKey = "relevant" | "rating" | "newest" | "price_asc" | "price_desc";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "relevant", label: "관련순" },
  { value: "rating", label: "평점 높은순" },
  { value: "newest", label: "최신순" },
  { value: "price_asc", label: "낮은 가격순" },
  { value: "price_desc", label: "높은 가격순" },
];

const CATEGORIES = [
  { id: "frontend", label: "프론트엔드" },
  { id: "backend", label: "백엔드" },
  { id: "data", label: "데이터" },
  { id: "ai", label: "AI/ML" },
  { id: "mobile", label: "모바일" },
  { id: "design", label: "디자인" },
  { id: "devops", label: "DevOps" },
  { id: "etc", label: "기타" },
];

const TYPES: { id: CourseType; label: string }[] = [
  { id: "online", label: "온라인" },
  { id: "offline", label: "오프라인" },
  { id: "blended", label: "온+오프라인" },
];

const LEVELS = ["입문", "초급", "중급", "고급"];

// ── Filter sidebar section ───────────────────────────────────────────────────

function FilterSection({ title, children, defaultOpen = true }: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-zinc-800 py-4">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between text-sm font-semibold text-zinc-300 mb-3"
      >
        {title}
        {open ? <ChevronUp className="w-4 h-4 text-zinc-500" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
      </button>
      {open && children}
    </div>
  );
}

// ── Search result card ────────────────────────────────────────────────────────

function SearchResultCard({
  course,
  cart,
  wishlist,
  onAddToCart,
  onToggleWishlist,
}: {
  course: Course;
  cart: Set<string>;
  wishlist: Set<string>;
  onAddToCart: (id: string) => void;
  onToggleWishlist: (id: string) => void;
}) {
  const router = useRouter();
  const typeBadge = TYPE_BADGE[course.type!];
  const isInCart = cart.has(course.id);
  const isWishlisted = wishlist.has(course.id);

  return (
    <div
      className="flex gap-4 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-4 cursor-pointer group transition-all hover:bg-zinc-900/80"
      onClick={() => router.push(`/student/courses/${course.id}`)}
    >
      {/* Thumbnail */}
      <div
        className="w-40 h-28 rounded-xl shrink-0 relative overflow-hidden"
        style={{ background: course.thumbnail }}
      >
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
          <div className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Play className="w-4 h-4 fill-white text-white ml-0.5" />
          </div>
        </div>
        <div className="absolute top-2 left-2 flex gap-1">
          {course.isNew && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500 text-white">NEW</span>}
          {course.isBestseller && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500 text-white">BEST</span>}
        </div>
        <div className="absolute bottom-2 left-2">
          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${typeBadge.cls}`}>{typeBadge.label}</span>
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 flex flex-col gap-1.5">
        <p className="text-sm font-semibold text-white leading-tight group-hover:text-violet-300 transition-colors line-clamp-2">
          {course.title}
        </p>
        <p className="text-xs text-zinc-500">{course.instructor} · {course.level}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {(course.tags ?? []).slice(0, 3).map((tag) => (
            <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-zinc-800 text-zinc-400 rounded border border-zinc-700">
              {tag}
            </span>
          ))}
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1.5 text-xs">
          <div className="flex items-center gap-0.5">
            {[1,2,3,4,5].map((s) => (
              <Star key={s} className={`w-3 h-3 ${s <= Math.round(course.rating ?? 0) ? "fill-amber-400 text-amber-400" : "text-zinc-700"}`} />
            ))}
          </div>
          <span className="text-amber-400 font-medium">{course.rating}</span>
          <span className="text-zinc-600">
            ({(course.reviewCount ?? 0) >= 1000
              ? `${((course.reviewCount ?? 0) / 1000).toFixed(1)}k`
              : course.reviewCount})
          </span>
          <span className="text-zinc-700">·</span>
          <span className="text-zinc-500">{course.duration}</span>
        </div>

        {/* Offline details */}
        {course.type !== "online" && course.location && (
          <div className="flex items-center gap-3 text-xs text-zinc-500">
            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{course.location}</span>
            {course.nextSessionDate && <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{course.nextSessionDate} 개강</span>}
            {course.capacity !== undefined && course.enrolledCount !== undefined && (
              <span className="flex items-center gap-1"><Users className="w-3 h-3" />{course.enrolledCount}/{course.capacity}명</span>
            )}
          </div>
        )}
      </div>

      {/* Price + actions */}
      <div className="shrink-0 flex flex-col items-end justify-between gap-2 min-w-[100px]">
        <button
          onClick={(e) => { e.stopPropagation(); onToggleWishlist(course.id); }}
          className="p-2 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-400/10 transition-colors"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? "fill-rose-400 text-rose-400" : ""}`} />
        </button>

        <div className="flex flex-col items-end gap-1.5">
          <p className="text-base font-bold text-white">
            {(course.price ?? 0) === 0 ? "무료" : `₩${(course.price ?? 0).toLocaleString()}`}
          </p>
          {(course.price ?? 0) > 0 ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (!isInCart) onAddToCart(course.id);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                isInCart
                  ? "bg-zinc-700 text-zinc-400 cursor-default"
                  : "bg-zinc-800 hover:bg-violet-600 text-zinc-300 hover:text-white"
              }`}
            >
              {isInCart ? "담김" : "담기"}
            </button>
          ) : (
            <Link
              href={`/student/courses/${course.id}`}
              onClick={(e) => e.stopPropagation()}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-900/40 text-emerald-400 hover:bg-emerald-900/60 transition-colors"
            >
              무료 수강
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main feature ─────────────────────────────────────────────────────────────

export default function SearchFeature() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [inputValue, setInputValue] = useState(searchParams.get("q") ?? "");
  const [sortBy, setSortBy] = useState<SortKey>("relevant");
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
  const [selectedTypes, setSelectedTypes] = useState<Set<CourseType>>(new Set());
  const [selectedLevels, setSelectedLevels] = useState<Set<string>>(new Set());
  const [priceFilter, setPriceFilter] = useState<"all" | "free" | "paid">("all");
  const [filterOpen, setFilterOpen] = useState(false);

  const [cart, setCart] = useState<Set<string>>(store.cart);
  const [wishlist, setWishlist] = useState<Set<string>>(store.wishlist);

  const addToCart = (id: string) => {
    store.cart = new Set([...store.cart, id]);
    setCart(new Set(store.cart));
  };
  const toggleWishlist = (id: string) => {
    const next = new Set(store.wishlist);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    store.wishlist = next;
    setWishlist(new Set(store.wishlist));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setQuery(inputValue);
    router.replace(`/student/search?q=${encodeURIComponent(inputValue)}`);
  };

  const toggleSet = <T,>(set: Set<T>, value: T): Set<T> => {
    const next = new Set(set);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    return next;
  };

  const hasFilters = selectedCategories.size > 0 || selectedTypes.size > 0
    || selectedLevels.size > 0 || priceFilter !== "all";

  const clearFilters = () => {
    setSelectedCategories(new Set());
    setSelectedTypes(new Set());
    setSelectedLevels(new Set());
    setPriceFilter("all");
  };

  const results = useMemo(() => {
    let items = [...allCourses];

    // Text search
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      items = items.filter((c) =>
        c.title.toLowerCase().includes(q) ||
        (c.instructor ?? "").toLowerCase().includes(q) ||
        (c.tags ?? []).some((t) => t.toLowerCase().includes(q)) ||
        (c.categoryLabel ?? "").toLowerCase().includes(q)
      );
    }

    // Category
    if (selectedCategories.size > 0) {
      items = items.filter((c) => selectedCategories.has(c.category ?? ""));
    }

    // Type
    if (selectedTypes.size > 0) {
      items = items.filter((c) => selectedTypes.has(c.type!));
    }

    // Level
    if (selectedLevels.size > 0) {
      items = items.filter((c) => selectedLevels.has(c.level ?? ""));
    }

    // Price
    if (priceFilter === "free") items = items.filter((c) => (c.price ?? 0) === 0);
    if (priceFilter === "paid") items = items.filter((c) => (c.price ?? 0) > 0);

    // Sort
    if (sortBy === "rating") items.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    else if (sortBy === "price_asc") items.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
    else if (sortBy === "price_desc") items.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
    else if (sortBy === "newest") items.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    // relevant: default order

    return items;
  }, [query, selectedCategories, selectedTypes, selectedLevels, priceFilter, sortBy]);

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar cartCount={cart.size} />

      <div className="max-w-screen-xl mx-auto px-6 py-8">
        {/* Search bar */}
        <form onSubmit={handleSearch} className="relative mb-8 max-w-2xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 pointer-events-none" />
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="강의, 강사, 기술 스택 검색..."
            className="w-full pl-12 pr-24 py-4 bg-zinc-900 border border-zinc-700 focus:border-violet-500 rounded-2xl text-white text-base placeholder-zinc-600 focus:outline-none transition-colors"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            검색
          </button>
        </form>

        <div className="flex gap-8 items-start">
          {/* Filter sidebar — desktop */}
          <aside className="w-56 shrink-0 hidden lg:block">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-bold text-white flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4" />
                필터
              </p>
              {hasFilters && (
                <button onClick={clearFilters} className="text-xs text-violet-400 hover:text-violet-300 transition-colors">
                  초기화
                </button>
              )}
            </div>

            <FilterSection title="카테고리">
              <div className="flex flex-col gap-1.5">
                {CATEGORIES.map((cat) => (
                  <label key={cat.id} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedCategories.has(cat.id)}
                      onChange={() => setSelectedCategories(toggleSet(selectedCategories, cat.id))}
                      className="w-3.5 h-3.5 accent-violet-500 cursor-pointer"
                    />
                    <span className="text-sm text-zinc-400 group-hover:text-zinc-200 transition-colors">{cat.label}</span>
                  </label>
                ))}
              </div>
            </FilterSection>

            <FilterSection title="수업 방식" defaultOpen={true}>
              <div className="flex flex-col gap-1.5">
                {TYPES.map((t) => (
                  <label key={t.id} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedTypes.has(t.id)}
                      onChange={() => setSelectedTypes(toggleSet(selectedTypes, t.id))}
                      className="w-3.5 h-3.5 accent-violet-500 cursor-pointer"
                    />
                    <span className="text-sm text-zinc-400 group-hover:text-zinc-200 transition-colors">{t.label}</span>
                  </label>
                ))}
              </div>
            </FilterSection>

            <FilterSection title="난이도" defaultOpen={true}>
              <div className="flex flex-col gap-1.5">
                {LEVELS.map((level) => (
                  <label key={level} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedLevels.has(level)}
                      onChange={() => setSelectedLevels(toggleSet(selectedLevels, level))}
                      className="w-3.5 h-3.5 accent-violet-500 cursor-pointer"
                    />
                    <span className="text-sm text-zinc-400 group-hover:text-zinc-200 transition-colors">{level}</span>
                  </label>
                ))}
              </div>
            </FilterSection>

            <FilterSection title="가격" defaultOpen={true}>
              <div className="flex flex-col gap-1.5">
                {([["all", "전체"], ["free", "무료"], ["paid", "유료"]] as const).map(([val, label]) => (
                  <label key={val} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="radio"
                      checked={priceFilter === val}
                      onChange={() => setPriceFilter(val)}
                      className="w-3.5 h-3.5 accent-violet-500 cursor-pointer"
                    />
                    <span className="text-sm text-zinc-400 group-hover:text-zinc-200 transition-colors">{label}</span>
                  </label>
                ))}
              </div>
            </FilterSection>
          </aside>

          {/* Results area */}
          <div className="flex-1 min-w-0">
            {/* Result header */}
            <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <p className="text-sm text-zinc-400">
                  {query ? (
                    <><span className="text-white font-semibold">"{query}"</span> 검색 결과 </>
                  ) : (
                    "전체 강의 "
                  )}
                  <span className="text-violet-400 font-semibold">{results.length}개</span>
                </p>
                {/* Mobile filter toggle */}
                <button
                  onClick={() => setFilterOpen(!filterOpen)}
                  className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs rounded-lg"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  필터
                  {hasFilters && <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />}
                </button>
              </div>

              {/* Sort */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-500 hidden sm:inline">정렬</span>
                <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 rounded-lg p-1">
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setSortBy(opt.value)}
                      className={`px-2.5 py-1.5 text-xs rounded-md transition-colors ${
                        sortBy === opt.value
                          ? "bg-zinc-700 text-white font-medium"
                          : "text-zinc-500 hover:text-zinc-300"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Active filter chips */}
            {hasFilters && (
              <div className="flex flex-wrap gap-2 mb-4">
                {[...selectedCategories].map((id) => {
                  const cat = CATEGORIES.find((c) => c.id === id);
                  return (
                    <button
                      key={id}
                      onClick={() => setSelectedCategories(toggleSet(selectedCategories, id))}
                      className="flex items-center gap-1 px-2.5 py-1 bg-violet-500/10 text-violet-400 border border-violet-500/30 text-xs rounded-full hover:bg-violet-500/20 transition-colors"
                    >
                      {cat?.label}
                      <X className="w-3 h-3" />
                    </button>
                  );
                })}
                {[...selectedTypes].map((t) => (
                  <button
                    key={t}
                    onClick={() => setSelectedTypes(toggleSet(selectedTypes, t))}
                    className="flex items-center gap-1 px-2.5 py-1 bg-violet-500/10 text-violet-400 border border-violet-500/30 text-xs rounded-full hover:bg-violet-500/20 transition-colors"
                  >
                    {TYPES.find((x) => x.id === t)?.label}
                    <X className="w-3 h-3" />
                  </button>
                ))}
                {[...selectedLevels].map((level) => (
                  <button
                    key={level}
                    onClick={() => setSelectedLevels(toggleSet(selectedLevels, level))}
                    className="flex items-center gap-1 px-2.5 py-1 bg-violet-500/10 text-violet-400 border border-violet-500/30 text-xs rounded-full hover:bg-violet-500/20 transition-colors"
                  >
                    {level}
                    <X className="w-3 h-3" />
                  </button>
                ))}
                {priceFilter !== "all" && (
                  <button
                    onClick={() => setPriceFilter("all")}
                    className="flex items-center gap-1 px-2.5 py-1 bg-violet-500/10 text-violet-400 border border-violet-500/30 text-xs rounded-full hover:bg-violet-500/20 transition-colors"
                  >
                    {priceFilter === "free" ? "무료" : "유료"}
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            )}

            {/* Results list */}
            {results.length > 0 ? (
              <div className="flex flex-col gap-3">
                {results.map((course) => (
                  <SearchResultCard
                    key={course.id}
                    course={course}
                    cart={cart}
                    wishlist={wishlist}
                    onAddToCart={addToCart}
                    onToggleWishlist={toggleWishlist}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 gap-4">
                <Search className="w-14 h-14 text-zinc-700" />
                <p className="text-zinc-400 font-medium">
                  {query ? `"${query}"에 대한 검색 결과가 없습니다` : "검색어를 입력해 주세요"}
                </p>
                {(query || hasFilters) && (
                  <div className="flex gap-2">
                    {query && (
                      <button
                        onClick={() => { setQuery(""); setInputValue(""); router.replace("/student/search"); }}
                        className="text-sm text-violet-400 hover:text-violet-300 transition-colors"
                      >
                        검색어 지우기
                      </button>
                    )}
                    {hasFilters && (
                      <button onClick={clearFilters} className="text-sm text-violet-400 hover:text-violet-300 transition-colors">
                        필터 초기화
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
