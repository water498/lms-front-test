"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, CheckCheck } from "lucide-react";
import {
  type NotifItem,
  MOCK_NOTIFS,
  NOTIF_ICON,
  NOTIF_TYPE_LABEL,
} from "../../shared/notification-data";

// ── Component ────────────────────────────────────────────────────────────────

const PAGE_SIZE = 10;

export function NotificationsTab() {
  const router = useRouter();
  const [notifs, setNotifs] = useState<NotifItem[]>(MOCK_NOTIFS);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const unreadCount = notifs.filter((n) => !n.read).length;

  const filtered = filter === "all" ? notifs : notifs.filter((n) => !n.read);
  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const markRead = (id: string) =>
    setNotifs((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));

  const markAllRead = () =>
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));

  const handleClick = (notif: NotifItem) => {
    markRead(notif.id);
    if (notif.linkUrl) {
      router.push(notif.linkUrl);
    }
  };

  // ── Empty state ──────────────────────────────────────────────────────────
  if (notifs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Bell className="w-14 h-14 text-zinc-700" />
        <p className="text-zinc-400 text-base font-medium">알림이 없습니다</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Filter: 전체 / 안 읽음 */}
          {(["all", "unread"] as const).map((key) => (
            <button
              key={key}
              onClick={() => {
                setFilter(key);
                setVisibleCount(PAGE_SIZE);
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filter === key
                  ? "bg-violet-600 text-white"
                  : "bg-zinc-800 text-zinc-400 hover:text-white"
              }`}
            >
              {key === "all" ? "전체" : `안 읽음${unreadCount > 0 ? ` (${unreadCount})` : ""}`}
            </button>
          ))}
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            모두 읽음
          </button>
        )}
      </div>

      {/* Notification list */}
      {visible.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <Bell className="w-12 h-12 text-zinc-700" />
          <p className="text-zinc-500 text-sm">읽지 않은 알림이 없습니다.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {visible.map((notif) => (
              <button
                key={notif.id}
                onClick={() => handleClick(notif)}
                className={`group w-full flex items-start gap-3.5 px-4 py-3.5 rounded-xl text-left transition-colors border ${
                  notif.linkUrl ? "cursor-pointer" : ""
                } ${
                  !notif.read
                    ? "bg-violet-500/5 border-violet-500/10 hover:bg-violet-500/10"
                    : "bg-zinc-900 border-zinc-800 hover:bg-zinc-800/70"
                }`}
              >
                {/* Icon */}
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    !notif.read ? "bg-zinc-800" : "bg-zinc-800/50"
                  }`}
                >
                  {NOTIF_ICON[notif.type]}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                        !notif.read
                          ? "bg-violet-500/15 text-violet-400"
                          : "bg-zinc-800 text-zinc-500"
                      }`}
                    >
                      {NOTIF_TYPE_LABEL[notif.type]}
                    </span>
                    <p
                      className={`text-sm font-semibold ${!notif.read ? "text-white" : "text-zinc-300"}`}
                    >
                      {notif.title}
                    </p>
                    {!notif.read && (
                      <span className="w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0" />
                    )}
                    <span className="ml-auto text-[10px] text-zinc-600 shrink-0">
                      {notif.time}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 leading-relaxed">
                    {notif.body}
                  </p>
                </div>
              </button>
          ))}

          {/* Load more */}
          {hasMore && (
            <button
              onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
              className="mt-2 w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-medium rounded-xl transition-colors"
            >
              더 보기 ({filtered.length - visibleCount}개 남음)
            </button>
          )}
        </div>
      )}
    </div>
  );
}
