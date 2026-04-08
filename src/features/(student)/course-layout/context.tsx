"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { allCourses, inProgressCourses, type EnrolledCourse } from "../student-dashboard/mockData";
import { completedCourseMock } from "../my-page-layout/sections/learning-tab";
import { courseDetails, defaultCourseDetail, type CourseDetail } from "../course-layout/mockData";
import store from "../student-dashboard/store";

interface CourseContextValue {
  courseId: string;
  course: EnrolledCourse;
  detail: CourseDetail;
  isActive: boolean;
  isCompleted: boolean;
  isEnrolled: boolean;
  enrolledSessionId: string | undefined;
  averageRating: number;
  cart: Set<string>;
  wishlist: Set<string>;
  addToCart: (id: string) => void;
  toggleWishlist: (id: string) => void;
  instructorModalOpen: boolean;
  setInstructorModalOpen: (open: boolean) => void;
}

const CourseContext = createContext<CourseContextValue | null>(null);

export function useCourseContext() {
  const ctx = useContext(CourseContext);
  if (!ctx) throw new Error("useCourseContext must be used within CourseProvider");
  return ctx;
}

interface CourseProviderProps {
  courseId: string;
  children: ReactNode;
}

export function CourseProvider({ courseId, children }: CourseProviderProps) {
  const [cart, setCartState] = useState<Set<string>>(store.cart);
  const [wishlist, setWishlistState] = useState<Set<string>>(store.wishlist);
  const [instructorModalOpen, setInstructorModalOpen] = useState(false);

  const allCoursesList = [...inProgressCourses, ...completedCourseMock, ...allCourses];
  const course = allCoursesList.find((c) => c.id === courseId) as EnrolledCourse | undefined;
  const detail = courseDetails[courseId] ?? defaultCourseDetail;

  const isActive = inProgressCourses.some((c) => c.id === courseId);
  const isCompleted = completedCourseMock.some((c) => c.id === courseId);
  const isEnrolled = isActive;
  const enrolledSessionId = inProgressCourses.find((c) => c.id === courseId)?.sessionId;

  const averageRating =
    detail.reviews.length > 0
      ? detail.reviews.reduce((sum, r) => sum + r.rating, 0) / detail.reviews.length
      : course?.rating ?? 0;

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

  if (!course) {
    return (
      <div className="bg-zinc-950 text-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-zinc-400 mb-4">강의를 찾을 수 없습니다.</p>
          <a
            href="/experiments/student"
            className="text-violet-400 hover:text-violet-300 text-sm"
          >
            홈으로 돌아가기
          </a>
        </div>
      </div>
    );
  }

  return (
    <CourseContext.Provider
      value={{
        courseId,
        course,
        detail,
        isActive,
        isCompleted,
        isEnrolled,
        enrolledSessionId,
        averageRating,
        cart,
        wishlist,
        addToCart,
        toggleWishlist,
        instructorModalOpen,
        setInstructorModalOpen,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
}
