import React from "react";
import type { TaskModel, TaskQuadrant } from "../models/TaskModel";

export interface QuadrantProps {
  quadrant: TaskQuadrant;
  tasks: TaskModel[];
  onViewTask: (task: TaskModel) => void;
}

export type DashboardGridProps = QuadrantProps;

const QUADRANT_CONFIG: Record<
  TaskQuadrant,
  {
    title: string;
    cardBg: string;
    border: string;
    headerBorder: string;
    badgeBg: string;
    badgeText: string;
    titleColor: string;
    eyeColor: string;
    itemBg: string;
    itemBorder: string;
    itemHoverBorder: string;
    itemTextColor: string;
    infoIconColor: string;
    emptyBg: string;
    emptyText: string;
  }
> = {
  importantUrgent: {
    title: "1 - Important & Urgent",
    cardBg: "bg-rose-50/90 hover:bg-rose-50",
    border: "border-2 border-rose-300/90",
    headerBorder: "border-rose-200/80",
    badgeBg: "bg-rose-500 text-white font-bold shadow-xs",
    badgeText: "Q1",
    titleColor: "text-rose-950 font-extrabold",
    eyeColor: "text-rose-400 hover:text-rose-600",
    itemBg: "bg-white/90",
    itemBorder: "border-rose-200/90",
    itemHoverBorder: "hover:border-rose-400",
    itemTextColor: "text-rose-950 font-semibold",
    infoIconColor: "text-rose-400 hover:text-rose-600",
    emptyBg: "bg-white/60 border-rose-200/80",
    emptyText: "text-rose-400",
  },
  importantNotUrgent: {
    title: "2 - Important & Not Urgent",
    cardBg: "bg-amber-50/90 hover:bg-amber-50",
    border: "border-2 border-amber-300/90",
    headerBorder: "border-amber-200/80",
    badgeBg: "bg-amber-500 text-white font-bold shadow-xs",
    badgeText: "Q2",
    titleColor: "text-amber-950 font-extrabold",
    eyeColor: "text-amber-400 hover:text-amber-600",
    itemBg: "bg-white/90",
    itemBorder: "border-amber-200/90",
    itemHoverBorder: "hover:border-amber-400",
    itemTextColor: "text-amber-950 font-semibold",
    infoIconColor: "text-amber-400 hover:text-amber-600",
    emptyBg: "bg-white/60 border-amber-200/80",
    emptyText: "text-amber-500",
  },
  notImportantUrgent: {
    title: "3 - Not Important & Urgent",
    cardBg: "bg-sky-50/90 hover:bg-sky-50",
    border: "border-2 border-sky-300/90",
    headerBorder: "border-sky-200/80",
    badgeBg: "bg-sky-500 text-white font-bold shadow-xs",
    badgeText: "Q3",
    titleColor: "text-sky-950 font-extrabold",
    eyeColor: "text-sky-400 hover:text-sky-600",
    itemBg: "bg-white/90",
    itemBorder: "border-sky-200/90",
    itemHoverBorder: "hover:border-sky-400",
    itemTextColor: "text-sky-950 font-semibold",
    infoIconColor: "text-sky-400 hover:text-sky-600",
    emptyBg: "bg-white/60 border-sky-200/80",
    emptyText: "text-sky-500",
  },
  notImportantNotUrgent: {
    title: "4 - Not Important & Not Urgent",
    cardBg: "bg-purple-50/90 hover:bg-purple-50",
    border: "border-2 border-purple-300/90",
    headerBorder: "border-purple-200/80",
    badgeBg: "bg-purple-500 text-white font-bold shadow-xs",
    badgeText: "Q4",
    titleColor: "text-purple-950 font-extrabold",
    eyeColor: "text-purple-400 hover:text-purple-600",
    itemBg: "bg-white/90",
    itemBorder: "border-purple-200/90",
    itemHoverBorder: "hover:border-purple-400",
    itemTextColor: "text-purple-950 font-semibold",
    infoIconColor: "text-purple-400 hover:text-purple-600",
    emptyBg: "bg-white/60 border-purple-200/80",
    emptyText: "text-purple-400",
  },
};

export const Quadrant: React.FC<QuadrantProps> = ({
  quadrant,
  tasks,
  onViewTask,
}) => {
  const config = QUADRANT_CONFIG[quadrant] || QUADRANT_CONFIG.importantUrgent;

  // Filter tasks belonging to this quadrant and show ONLY 3 most recent task cards
  const quadrantTasks = tasks
    .filter((t) => t.quadrant === quadrant)
    .slice(0, 3);

  return (
    <div
      className={`${config.cardBg} rounded-2xl p-4 border ${config.border} shadow-sm transition-all flex flex-col justify-between gap-3 h-full`}
    >
      {/* Top Header: Quadrant Badge, Title & Eye Icon (No Functionality) */}
      <div
        className={`flex items-center justify-between gap-2 border-b ${config.headerBorder} pb-2.5`}
      >
        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-bold px-2 py-0.5 rounded-md ${config.badgeBg}`}
          >
            {config.badgeText}
          </span>
          <h4 className={`text-xs ${config.titleColor} tracking-tight`}>
            {config.title}
          </h4>
        </div>

        {/* Eye Icon (No Functionality) */}
        <button
          type="button"
          tabIndex={-1}
          className={`${config.eyeColor} p-1 rounded-lg transition-colors cursor-default`}
          title="View Quadrant"
          aria-label="View Quadrant"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
        </button>
      </div>

      {/* Tasks List inside Quadrant (showing ONLY 3 task cards) */}
      <div className="flex-1 flex flex-col gap-2 min-h-[140px] justify-start">
        {quadrantTasks.length === 0 ? (
          <div
            className={`flex-1 flex items-center justify-center p-4 text-center text-xs ${config.emptyText} border border-dashed ${config.emptyBg} rounded-xl`}
          >
            No tasks in this quadrant
          </div>
        ) : (
          quadrantTasks.map((task) => (
            <div
              key={task.id}
              className={`${config.itemBg} border ${config.itemBorder} ${config.itemHoverBorder} rounded-xl px-3 py-2.5 flex items-center justify-between gap-2 shadow-2xs transition-all`}
            >
              <span
                className={`text-xs ${config.itemTextColor} truncate flex-1`}
              >
                {task.title}
              </span>

              {/* (i) Info Icon Button -> Opens task details in read-only mode */}
              <button
                type="button"
                onClick={() => onViewTask(task)}
                className={`${config.infoIconColor} p-1 rounded-md transition-colors cursor-pointer shrink-0`}
                title="View Task Details"
                aria-label="View Task Details"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export const DashboardGrid = Quadrant;
export default Quadrant;
