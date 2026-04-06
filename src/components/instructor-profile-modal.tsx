"use client";

import { X, Globe, Building2, Briefcase } from "lucide-react";
import { type InstructorProfile } from "@/lib/models";

interface Props {
  instructor: InstructorProfile;
  open: boolean;
  onClose: () => void;
}

export function InstructorProfileModal({ instructor, open, onClose }: Props) {
  if (!open) return null;

  const displayName = instructor.headline?.split("·")[0].trim() ?? "강사";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-zinc-800">
          <h3 className="text-base font-bold text-white">강사 프로필</h3>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-500 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 max-h-[70vh] overflow-y-auto flex flex-col gap-5">
          {/* Profile header */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0">
              {instructor.profileImageUrl ? (
                <img
                  src={instructor.profileImageUrl}
                  alt={displayName}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-2xl font-bold text-zinc-400">
                  {displayName.charAt(0)}
                </span>
              )}
            </div>
            <div className="min-w-0">
              <p className="text-lg font-semibold text-white">{displayName}</p>
              {instructor.headline && (
                <p className="text-sm text-zinc-400 mt-0.5">{instructor.headline}</p>
              )}
            </div>
          </div>

          {/* Meta info */}
          <div className="flex flex-wrap gap-3">
            {instructor.affiliatedCompany && (
              <span className="flex items-center gap-1.5 text-xs text-zinc-400">
                <Building2 className="w-3.5 h-3.5" />
                {instructor.affiliatedCompany}
              </span>
            )}
            {instructor.specialty && (
              <span className="flex items-center gap-1.5 text-xs text-zinc-400">
                <Briefcase className="w-3.5 h-3.5" />
                {instructor.specialty}
              </span>
            )}
            {instructor.websiteUrl && (
              <a
                href={instructor.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-violet-400 hover:text-violet-300 transition-colors"
              >
                <Globe className="w-3.5 h-3.5" />
                웹사이트
              </a>
            )}
          </div>

          {/* Expertise tags */}
          {(instructor.expertise?.length ?? 0) > 0 && (
            <div>
              <p className="text-xs font-medium text-zinc-500 mb-2">전문 분야</p>
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
            </div>
          )}

          {/* Bio */}
          {instructor.bio && (
            <div>
              <p className="text-xs font-medium text-zinc-500 mb-2">소개</p>
              <p className="text-sm text-zinc-300 leading-relaxed">{instructor.bio}</p>
            </div>
          )}

          {/* Career */}
          {instructor.career && (
            <div>
              <p className="text-xs font-medium text-zinc-500 mb-2">경력</p>
              <p className="text-sm text-zinc-300 leading-relaxed">{instructor.career}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
