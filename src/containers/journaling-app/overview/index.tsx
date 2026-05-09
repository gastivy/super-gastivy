import { useState, useMemo } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  addMonths,
  subMonths,
  isSameDay,
  parseISO,
  isValid,
} from "date-fns";
import { useJournalsByDateRange, useJournalDates, useDeleteJournal } from "@modules/journaling/hooks/useJournals";
import TiptapEditor from "@components/base/TiptapEditor";
import Icon from "@components/base/Icon";
import Button from "@components/base/Button";
import { routes } from "@constants/routes";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const JournalOverviewContainer = () => {
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const startDate = format(monthStart, "yyyy-MM-dd");
  const endDate = format(monthEnd, "yyyy-MM-dd");

  const { data: journalDates = new Set() } = useJournalDates(startDate, endDate);

  const filterStart = selectedDate
    ? format(selectedDate, "yyyy-MM-dd")
    : startDate;
  const filterEnd = selectedDate
    ? format(selectedDate, "yyyy-MM-dd")
    : endDate;

  const { data: journals = [], refetch } = useJournalsByDateRange(
    filterStart,
    filterEnd
  );

  const deleteMutation = useDeleteJournal();

  const calendarDays = useMemo(() => {
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
    const startDay = getDay(monthStart);
    const blanks = Array(startDay).fill(null);
    return [...blanks, ...days];
  }, [currentMonth, monthStart, monthEnd]);

  const handleDelete = async (id: number) => {
    await deleteMutation.mutateAsync(id);
    if (expandedId === id) setExpandedId(null);
    refetch();
  };

  const toggleExpand = (id: number) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-shark-900">Journal</h1>
        <Button
          onClick={() => navigate({ to: routes.journaling.create.path })}
          className="flex items-center gap-2"
        >
          <Icon name="Plus-solid" size={14} />
          New Journal
        </Button>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left: Journal List (8/12) */}
        <div className="col-span-8 space-y-3">
          {journals.length === 0 ? (
            <div className="rounded-xl border border-shark-200 bg-white p-8 text-center">
              <p className="text-sm text-shark-900">No journals found</p>
              <button
                onClick={() =>
                  navigate({
                    to: routes.journaling.create.path,
                    search: selectedDate
                      ? { date: format(selectedDate, "yyyy-MM-dd") }
                      : undefined,
                  })
                }
                className="mt-2 text-sm text-shark-900 hover:text-shark-700 transition-colors cursor-pointer"
              >
                Create one now →
              </button>
            </div>
          ) : (
            journals.map((journal) => {
              const isExpanded = expandedId === journal.id;

              return (
                <div
                  key={journal.id}
                  className={`rounded-xl border bg-white transition-colors ${
                    isExpanded
                      ? "border-green-yellow-400"
                      : "border-shark-200 hover:bg-shark-50"
                  }`}
                >
                  {/* Collapsible Header */}
                  <div
                    className="flex items-center justify-between p-4 cursor-pointer"
                    onClick={() =>
                      journal.id && toggleExpand(journal.id)
                    }
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <Icon
                        name="Down-outline"
                        size={16}
                        className={`text-shark-400 transition-transform duration-200 shrink-0 ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-shark-900 truncate">
                          {journal.title || "Untitled"}
                        </h4>
                        <p className="text-xs text-shark-500 mt-0.5">
                          {format(
                            isValid(parseISO(journal.date))
                              ? parseISO(journal.date)
                              : new Date(),
                            "MMMM d, yyyy"
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate({
                            to: routes.journaling.create.path,
                            search: { edit: journal.id },
                          });
                        }}
                        className="p-1 text-shark-400 hover:text-shark-900 transition-colors"
                      >
                        <Icon name="Edit-outline" size={14} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (journal.id) handleDelete(journal.id);
                        }}
                        className="p-1 text-shark-400 hover:text-red-500 transition-colors"
                      >
                        <Icon name="Trash-outline" size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {isExpanded && journal.content && (
                    <div className="border-t border-shark-200 px-4 pb-4 pt-3">
                      <div className="ml-7">
                        <TiptapEditor
                          content={journal.content}
                          editable={false}
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Right: Calendar (4/12, sticky) */}
        <div className="col-span-4">
          <div className="sticky top-6">
            <div className="rounded-xl border border-shark-200 bg-white p-4">
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                  className="p-1 text-shark-400 hover:text-shark-950 transition-colors"
                >
                  <Icon name="Arrow-Left-outline" size={16} />
                </button>
                <h2 className="text-sm font-semibold text-shark-950">
                  {format(currentMonth, "MMMM yyyy")}
                </h2>
                <button
                  onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                  className="p-1 text-shark-400 hover:text-shark-950 transition-colors"
                >
                  <Icon name="Arrow-Right-outline" size={16} />
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
                  const isSelected = selectedDate && isSameDay(day, selectedDate);
                  const isToday = isSameDay(day, new Date());

                  return (
                    <button
                      key={dateStr}
                      onClick={() => setSelectedDate(day)}
                      className={`relative flex flex-col items-center justify-center rounded-lg py-1.5 text-xs transition-colors ${
                        isSelected
                          ? "bg-green-yellow-400 text-shark-950 font-semibold"
                          : isToday
                            ? "bg-shark-100 text-shark-950"
                            : "text-shark-700 hover:bg-shark-100"
                      }`}
                    >
                      {format(day, "d")}
                      {hasJournal && (
                        <span
                          className={`mt-0.5 h-1 w-1 rounded-full ${
                            isSelected ? "bg-shark-950" : "bg-green-yellow-400"
                          }`}
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {selectedDate && (
                <button
                  onClick={() => setSelectedDate(null)}
                  className="mt-3 text-xs text-shark-400 hover:text-shark-700 transition-colors"
                >
                  Show all for this month
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JournalOverviewContainer;
