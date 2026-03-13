"use client";

import { useState } from "react";
import { Play, Star, TrendingUp } from "lucide-react";
import { Navbar } from "./components/navbar";
import { Footer } from "./components/footer";
import { HeroBanner } from "./sections/hero-banner";
import { ScrollSection } from "./sections/scroll-section";
import { CategorySection } from "./sections/category-section";
import { StatsWidget } from "./sections/stats-widget";
import { AnnouncementGrid } from "./sections/announcement-grid";
import { ContextPanel } from "./sections/context-panel";
import { type CardActions } from "./components/course-card";
import { inProgressCourses, recommendedCourses, popularCourses } from "./mockData";
import store from "./store";

export default function B2cStudentFeature() {
  const [cart, setCartState] = useState<Set<string>>(store.cart);
  const [wishlist, setWishlistState] = useState<Set<string>>(store.wishlist);

  const addToCart = (id: string) => {
    store.cart = new Set([...store.cart, id]);
    setCartState(new Set(store.cart));
  };

  const toggleWishlist = (id: string) => {
    const next = new Set(store.wishlist);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    store.wishlist = next;
    setWishlistState(new Set(store.wishlist));
  };

  const actions: CardActions = { cart, wishlist, onAddToCart: addToCart, onToggleWishlist: toggleWishlist };

  return (
    <div className="bg-zinc-950 text-white min-h-screen">
      <Navbar cartCount={cart.size} />
      <ContextPanel />
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
          actions={actions}
        />

        {/* 지금 인기있는 강의 */}
        <ScrollSection
          title="지금 인기있는 강의"
          icon={<TrendingUp className="w-5 h-5" />}
          courses={popularCourses}
          actions={actions}
        />

        {/* 카테고리별 추천 */}
        <CategorySection actions={actions} />

        {/* 내 학습 현황 */}
        <StatsWidget />

        {/* 공지/이벤트 */}
        <AnnouncementGrid />
      </div>

      <Footer />
    </div>
  );
}
