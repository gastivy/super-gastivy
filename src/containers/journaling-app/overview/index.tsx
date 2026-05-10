import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  IconBookmark,
  IconCalendar,
  IconClock,
  IconPlus,
} from "@tabler/icons-react";
import { useNavigate } from "@tanstack/react-router";
import { format, parseISO } from "date-fns";

import Button from "@components/base/Button";
import { routes } from "@constants/routes";
import {
  useJournalCount,
  useJournalsPage,
} from "@modules/journaling/hooks/useJournals";

const JOURNAL_COLORS = [
  "bg-blue-100 text-blue-700",
  "bg-emerald-100 text-emerald-700",
  "bg-violet-100 text-violet-700",
  "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700",
  "bg-cyan-100 text-cyan-700",
];

function getColorForDate(dateStr: string): string {
  const hash = dateStr
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return JOURNAL_COLORS[hash % JOURNAL_COLORS.length];
}

function extractPreview(content: string): string {
  try {
    const doc = JSON.parse(content);
    return extractTextFromDoc(doc);
  } catch {
    return content || "";
  }
}

function extractTextFromDoc(node: Record<string, unknown>): string {
  if (node.type === "text" && typeof node.text === "string") {
    return node.text;
  }
  if (Array.isArray(node.content)) {
    return (node.content as Record<string, unknown>[])
      .map(extractTextFromDoc)
      .join(" ");
  }
  return "";
}

function getReadingTime(text: string): number {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

const JournalOverviewContainer = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const { data: totalCount = 0 } = useJournalCount();
  const { data: currentPageJournals = [], isFetching: isFetchingPage } =
    useJournalsPage(page);

  // Accumulate journals from all loaded pages
  const [loadedPages, setLoadedPages] = useState<
    Record<number, typeof currentPageJournals>
  >({});

  useEffect(() => {
    if (currentPageJournals.length > 0) {
      setLoadedPages((prev) => {
        if (prev[page] === currentPageJournals) return prev;
        return { ...prev, [page]: currentPageJournals };
      });
    }
  }, [page, currentPageJournals]);

  const allJournals = useMemo(() => {
    const sortedKeys = Object.keys(loadedPages)
      .map(Number)
      .sort((a, b) => a - b);
    const result: typeof currentPageJournals = [];
    for (const key of sortedKeys) {
      result.push(...loadedPages[key]);
    }
    return result;
  }, [loadedPages]);

  const hasMore = allJournals.length < totalCount;

  // Group journals by month
  const groupedJournals = useMemo(() => {
    const groups: Record<string, typeof allJournals> = {};
    for (const journal of allJournals) {
      const date = parseISO(journal.date);
      const monthKey = format(date, "yyyy-MM");
      const monthLabel = format(date, "MMMM yyyy");
      const key = `${monthKey}__${monthLabel}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(journal);
    }
    return Object.entries(groups).sort(([a], [b]) => b.localeCompare(a));
  }, [allJournals]);

  // Infinite scroll via IntersectionObserver
  const handleLoadMore = useCallback(() => {
    if (hasMore && !isFetchingPage) {
      setPage((prev) => prev + 1);
    }
  }, [hasMore, isFetchingPage]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          handleLoadMore();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [handleLoadMore, hasMore]);

  // Initial empty check (only before any data loaded)
  const isEmpty = totalCount === 0 && !isFetchingPage;

  return (
    <div className="max-w-3xl mx-auto pb-12 relative">
      <div className="flex items-center justify-between mb-8 sticky border border-shark-100 bg-white top-0 left-0 p-4 rounded-2xl z-10">
        <div>
          <h1 className="text-2xl font-bold text-shark-950 tracking-tight">
            Journal
          </h1>
          <p className="text-sm text-shark-500 mt-1">
            Your thoughts, stories, and reflections
          </p>
        </div>
        <Button
          className="flex items-center gap-2"
          shape="semi-round"
          onClick={() => navigate({ to: routes.journaling.create.path })}
        >
          <IconPlus size={16} />
          New Entry
        </Button>
      </div>

      {isEmpty ? (
        <EmptyState
          onCreate={() => navigate({ to: routes.journaling.create.path })}
        />
      ) : (
        <div className="space-y-10">
          {groupedJournals.map(([key, group]) => {
            const label = key.split("__")[1];
            return (
              <div key={key}>
                <div className="flex items-center gap-3 mb-4">
                  <IconCalendar size={16} className="text-shark-400" />
                  <h2 className="text-sm font-semibold text-shark-500 uppercase tracking-wider">
                    {label}
                  </h2>
                  <div className="flex-1 h-px bg-shark-200" />
                </div>

                <div className="space-y-4">
                  {group.map((journal) => {
                    const preview = extractPreview(journal.content);
                    const readingTime = getReadingTime(preview);
                    const colorClass = getColorForDate(journal.date);
                    const dateObj = parseISO(journal.date);
                    const dayLabel = format(dateObj, "MMM d");

                    return (
                      <article
                        key={journal.id}
                        onClick={() =>
                          navigate({
                            to: "/journaling/$id",
                            params: { id: String(journal.id) },
                          })
                        }
                        className="group cursor-pointer rounded-xl border border-shark-200 bg-white p-5 transition-all hover:border-shark-300 hover:shadow-sm"
                      >
                        <div className="flex items-start gap-4">
                          <div
                            className={`shrink-0 rounded-lg px-3 py-2 text-center ${colorClass}`}
                          >
                            <div className="text-xs font-semibold leading-tight">
                              {format(dateObj, "MMM")}
                            </div>
                            <div className="text-lg font-bold leading-tight">
                              {format(dateObj, "d")}
                            </div>
                          </div>

                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-shark-950 group-hover:text-shark-700 transition-colors leading-snug">
                              {journal.title || "Untitled"}
                            </h3>
                            {preview && (
                              <p className="mt-1.5 text-sm text-shark-500 line-clamp-2 leading-relaxed">
                                {preview}
                              </p>
                            )}
                            <div className="flex items-center gap-3 mt-3">
                              <span className="flex items-center gap-1 text-xs text-shark-400">
                                <IconClock size={12} />
                                {readingTime} min read
                              </span>
                              <span className="text-xs text-shark-300">·</span>
                              <span className="text-xs text-shark-400">
                                {dayLabel}
                              </span>
                            </div>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Sentinel for infinite scroll */}
          {hasMore && (
            <div ref={sentinelRef} className="flex justify-center py-8">
              {isFetchingPage && (
                <div className="flex items-center gap-2 text-sm text-shark-400">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-shark-300 border-t-shark-600" />
                  Loading more entries...
                </div>
              )}
            </div>
          )}

          {/* End of list indicator */}
          {!hasMore && allJournals.length > 0 && (
            <div className="text-center py-6">
              <p className="text-xs text-shark-400">
                You've reached the end — {totalCount} journal
                {totalCount !== 1 ? "s" : ""}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-20 h-20 rounded-full bg-shark-100 flex items-center justify-center mb-6">
        <IconBookmark size={32} className="text-shark-400" />
      </div>
      <h3 className="text-lg font-semibold text-shark-950 mb-2">
        No journals yet
      </h3>
      <p className="text-sm text-shark-500 max-w-sm mb-6">
        Start capturing your thoughts, stories, and reflections. Your journal
        entries will appear here.
      </p>
      <Button onClick={onCreate} className="flex items-center gap-2">
        <IconPlus size={16} />
        Write your first entry
      </Button>
    </div>
  );
}

export default JournalOverviewContainer;
