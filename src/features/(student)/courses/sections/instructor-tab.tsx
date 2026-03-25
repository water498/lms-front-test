"use client";

import { type InstructorProfile } from "@/lib/models";

interface Props {
  instructor: InstructorProfile;
}

export function InstructorTab({ instructor }: Props) {
  return (
    <div>
      <h2 className="text-base font-semibold text-white mb-5">강사 소개</h2>
      <div className="flex flex-col gap-5">
        {/* Profile header */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0">
            <span className="text-2xl font-bold text-zinc-400">
              {instructor.headline?.charAt(0) ?? "?"}
            </span>
          </div>
          <div>
            <p className="text-base font-semibold text-white">{instructor.headline?.split("·")[0].trim()}</p>
            <p className="text-sm text-zinc-400">{instructor.headline}</p>
            {instructor.affiliatedCompany && (
              <p className="text-xs text-zinc-500 mt-0.5">{instructor.affiliatedCompany}</p>
            )}
          </div>
        </div>

        {/* Expertise tags */}
        {(instructor.expertise?.length ?? 0) > 0 && (
          <div className="flex flex-wrap gap-2">
            {instructor.expertise?.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Bio */}
        <p className="text-sm text-zinc-400 leading-relaxed">{instructor.bio}</p>
      </div>
    </div>
  );
}
