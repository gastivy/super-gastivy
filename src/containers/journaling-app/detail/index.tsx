import { useMemo, useState } from "react";

import {
  IconArrowNarrowLeft,
  IconArrowNarrowRight,
  IconBookmark,
  IconClock,
  IconEdit,
  IconTrash,
} from "@tabler/icons-react";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isSameDay,
  isValid,
  parseISO,
  startOfMonth,
  subMonths,
} from "date-fns";

import Button from "@components/base/Button";
import TiptapEditor from "@components/base/TiptapEditor";
import { routes } from "@constants/routes";
import {
  useDeleteJournal,
  useJournal,
  useJournalDates,
  useJournalsByDateRange,
} from "@modules/journaling/hooks/useJournals";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

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

function getReadingTime(content: string): number {
  try {
    const doc = JSON.parse(content);
    const text = extractTextFromDoc(doc);
    const words = text.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 200));
  } catch {
    const words = content.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 200));
  }
}

const JournalDetailContainer = () => {
  const navigate = useNavigate();
  const { id } = useParams({ strict: false }) as { id: string };
  const journalId = Number(id);

  const { data: journal, isLoading } = useJournal(journalId);
  const deleteMutation = useDeleteJournal();

  // Calendar state
  const [currentMonth, setCurrentMonth] = useState(
    journal ? parseISO(journal.date) : new Date()
  );

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const startDate = format(monthStart, "yyyy-MM-dd");
  const endDate = format(monthEnd, "yyyy-MM-dd");

  const { data: journalDates = new Set() } = useJournalDates(
    startDate,
    endDate
  );

  const { data: monthJournals = [] } = useJournalsByDateRange(
    startDate,
    endDate
  );

  const calendarDays = useMemo(() => {
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
    const startDay = getDay(monthStart);
    const blanks = Array(startDay).fill(null);
    return [...blanks, ...days];
  }, [currentMonth, monthStart, monthEnd]);

  const handleDelete = async () => {
    if (!journal?.id) return;
    await deleteMutation.mutateAsync(journal.id);
    navigate({ to: routes.journaling.overview.path });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-shark-300 border-t-shark-900" />
      </div>
    );
  }

  if (!journal) {
    return (
      <div className="max-w-3xl mx-auto">
        <EmptyDetail
          onBack={() => navigate({ to: routes.journaling.overview.path })}
        />
      </div>
    );
  }

  const dateObj = parseISO(journal.date);
  const readingTime = getReadingTime(journal.content);
  const formattedDate = isValid(dateObj)
    ? format(dateObj, "MMMM d, yyyy")
    : "Unknown date";

  return (
    <div className="grid grid-cols-12 gap-8">
      <div className="col-span-12 lg:col-span-8">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate({ to: routes.journaling.overview.path })}
            className="flex items-center gap-2 text-sm text-shark-500 hover:text-shark-900 transition-colors"
          >
            <IconArrowNarrowLeft size={16} />
            Back to journals
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                navigate({
                  to: routes.journaling.create.path,
                  search: { edit: journal.id },
                })
              }
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-shark-600 hover:bg-shark-100 transition-colors"
            >
              <IconEdit size={14} />
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-red-500 hover:bg-red-50 transition-colors"
            >
              <IconTrash size={14} />
              Delete
            </button>
          </div>
        </div>

        <article className="bg-white rounded-xl border border-shark-200 overflow-hidden">
          <div className="px-8 pt-8 pb-6 border-b border-shark-100">
            <h1 className="text-3xl font-bold text-shark-950 tracking-tight leading-tight">
              {journal.title || "Untitled"}
            </h1>
            <div className="flex items-center gap-3 mt-4">
              <span className="text-sm text-shark-500">{formattedDate}</span>
              <span className="text-shark-300">·</span>
              <span className="flex items-center gap-1 text-sm text-shark-500">
                <IconClock size={14} />
                {readingTime} min read
              </span>
            </div>
          </div>

          <div className="px-8 py-8">
            {journal.content ? (
              <div className="prose prose-shark max-w-none">
                <TiptapEditor content={journal.content} editable={false} />
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-sm text-shark-400">
                  This journal entry has no content yet.
                </p>
                <button
                  onClick={() =>
                    navigate({
                      to: routes.journaling.create.path,
                      search: { edit: journal.id },
                    })
                  }
                  className="mt-3 text-sm text-shark-900 hover:text-shark-700 transition-colors cursor-pointer"
                >
                  Start writing →
                </button>
              </div>
            )}
          </div>
        </article>
      </div>

      <div className="col-span-12 lg:col-span-4">
        <div className="sticky top-6 space-y-4">
          <div className="rounded-xl border border-shark-200 bg-white p-4">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                className="p-1 text-shark-400 hover:text-shark-950 transition-colors"
              >
                <IconArrowNarrowLeft size={16} />
              </button>
              <h2 className="text-sm font-semibold text-shark-950">
                {format(currentMonth, "MMMM yyyy")}
              </h2>
              <button
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                className="p-1 text-shark-400 hover:text-shark-950 transition-colors"
              >
                <IconArrowNarrowRight size={16} />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1">
              {WEEKDAYS.map((day) => (
                <div
                  key={day}
                  className="text-center text-xs font-medium text-shark-500 py-1"
                >
                  {day}
                </div>
              ))}
              {calendarDays.map((day, idx) => {
                if (!day) return <div key={`blank-${idx}`} />;
                const dateStr = format(day, "yyyy-MM-dd");
                const hasJournal = journalDates.has(dateStr);
                const isCurrentJournal = journal && dateStr === journal.date;
                const isToday = isSameDay(day, new Date());

                return (
                  <button
                    key={dateStr}
                    onClick={() => {
                      const found = monthJournals.find(
                        (j) => j.date === dateStr
                      );
                      if (found?.id) {
                        navigate({
                          to: "/journaling/$id",
                          params: { id: String(found.id) },
                        });
                      }
                    }}
                    className={`relative flex flex-col items-center justify-center rounded-lg py-1.5 text-xs transition-colors ${
                      isCurrentJournal
                        ? "bg-green-yellow-400 text-shark-950 font-semibold"
                        : hasJournal
                          ? "bg-shark-100 text-shark-950 hover:bg-shark-200"
                          : isToday
                            ? "bg-shark-50 text-shark-950"
                            : "text-shark-700 hover:bg-shark-100"
                    }`}
                  >
                    {format(day, "d")}
                    {hasJournal && !isCurrentJournal && (
                      <span className="mt-0.5 h-1 w-1 rounded-full bg-green-yellow-400" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {monthJournals.length > 0 && (
            <div className="rounded-xl border border-shark-200 bg-white p-4">
              <h3 className="text-xs font-semibold text-shark-500 uppercase tracking-wider mb-3">
                This month
              </h3>
              <div className="space-y-1.5">
                {monthJournals.map((j) => (
                  <button
                    key={j.id}
                    onClick={() => {
                      if (j.id) {
                        navigate({
                          to: "/journaling/$id",
                          params: { id: String(j.id) },
                        });
                      }
                    }}
                    className={`w-full text-left rounded-lg px-3 py-2 text-sm transition-colors ${
                      j.id === journal?.id
                        ? "bg-green-yellow-50 text-shark-950 font-medium"
                        : "text-shark-600 hover:bg-shark-50"
                    }`}
                  >
                    <div className="truncate">{j.title || "Untitled"}</div>
                    <div className="text-xs text-shark-400 mt-0.5">
                      {format(parseISO(j.date), "MMM d")}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

function EmptyDetail({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-20 h-20 rounded-full bg-shark-100 flex items-center justify-center mb-6">
        <IconBookmark size={32} className="text-shark-400" />
      </div>
      <h3 className="text-lg font-semibold text-shark-950 mb-2">
        Journal not found
      </h3>
      <p className="text-sm text-shark-500 max-w-sm mb-6">
        This journal entry doesn't exist or may have been deleted.
      </p>
      <Button onClick={onBack}>Back to journals</Button>
    </div>
  );
}

export default JournalDetailContainer;
