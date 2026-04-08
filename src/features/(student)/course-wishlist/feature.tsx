"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Navbar } from "../student-dashboard/components/navbar";
import { Footer } from "../student-dashboard/components/footer";
import { WishlistTab } from "../my-page-layout/sections/wishlist-tab";
import store from "../student-dashboard/store";

export default function WishlistFeature() {
  const router = useRouter();
  const [cart] = useState<Set<string>>(store.cart);

  return (
    <div className="bg-zinc-950 text-white min-h-screen">
      <Navbar cartCount={cart.size} />

      <div className="max-w-screen-xl mx-auto px-6 py-8">
        {/* Back */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-300 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          뒤로
        </button>

        <h1 className="text-xl font-bold text-white mb-6">위시리스트</h1>

        <WishlistTab />
      </div>

      <Footer />
    </div>
  );
}
