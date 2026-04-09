"use client";

import { createContext, useContext, useState, type Dispatch, type SetStateAction, type ReactNode } from "react";
import { users } from "../user-list/mockData";
import type { User } from "../user-list/mockData";
import {
  instructorCourses,
  instructorReviews,
  instructorBankAccounts,
  instructorRevenues,
  type InstructorCourseAssignment,
} from "./mockData";
import type { InstructorReview, InstructorBankAccount, InstructorRevenue } from "@/lib/models";

interface UserDetailContextValue {
  userId: string;
  user: User;
  setUser: Dispatch<SetStateAction<User | undefined>>;
  isInstructor: boolean;
  instCourses: InstructorCourseAssignment[];
  instReviews: InstructorReview[];
  instRevenues: InstructorRevenue[];
  instBankAccounts: InstructorBankAccount[];
}

const UserDetailContext = createContext<UserDetailContextValue | null>(null);

export function useUserDetail() {
  const ctx = useContext(UserDetailContext);
  if (!ctx) throw new Error("useUserDetail must be used within UserDetailProvider");
  return ctx;
}

export function UserDetailProvider({ userId, children }: { userId: string; children: ReactNode }) {
  const [user, setUser] = useState<User | undefined>(() => users.find((u) => u.id === userId));

  if (!user) {
    throw new Error(`User ${userId} not found`);
  }

  const isInstructor = user.role === "INSTRUCTOR";

  return (
    <UserDetailContext.Provider
      value={{
        userId,
        user,
        setUser,
        isInstructor,
        instCourses: instructorCourses[userId] ?? [],
        instReviews: instructorReviews[userId] ?? [],
        instRevenues: instructorRevenues[userId] ?? [],
        instBankAccounts: instructorBankAccounts[userId] ?? [],
      }}
    >
      {children}
    </UserDetailContext.Provider>
  );
}
