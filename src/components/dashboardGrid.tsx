import React, { useState, useRef } from "react";
import type { TaskModel, TaskQuadrant, TaskStatus } from "../models/TaskModel";

export interface QuadrantProps {
  quadrant: TaskQuadrant;
  tasks: TaskModel[];
  onViewTask: (task: TaskModel) => void;
  onDropTask?: (taskId: string, targetQuadrant: TaskQuadrant) => void;
  onDeleteTask?: (taskId: string) => Promise<void> | void;
  onUpdateStatus?: (taskId: string, status: TaskStatus) => Promise<void> | void;
}

export type DashboardGridProps = QuadrantProps;

const QUADRANT_CONFIG: Record<
  Exclude<TaskQuadrant, "empty">,
  {
    title: string;
    cardBg: string;
    border: string;
    headerBorder: string;
    badgeBg: string;
    badgeText: string;
    titleColor: string;
 
    itemBg: string;
    itemBorder: string;
    itemHoverBorder: string;
    itemTextColor: string;
    infoIconColor: string;
    emptyBg: string;
    emptyText: string;
    scrollbarClass: string
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
    
    itemBg: "bg-white/90",
    itemBorder: "border-rose-200/90",
    itemHoverBorder: "hover:border-rose-400",
    itemTextColor: "text-rose-950 font-semibold",
    infoIconColor: "text-rose-400 hover:text-rose-600",
    emptyBg: "bg-white/60 border-rose-200/80",
    emptyText: "text-rose-400",
    scrollbarClass: "scrollbar-rose"
  },
  importantNotUrgent: {
    title: "2 - Important & Not Urgent",
    cardBg: "bg-amber-50/90 hover:bg-amber-50",
    border: "border-2 border-amber-300/90",
    headerBorder: "border-amber-200/80",
    badgeBg: "bg-amber-500 text-white font-bold shadow-xs",
    badgeText: "Q2",
    titleColor: "text-amber-950 font-extrabold",
 
    itemBg: "bg-white/90",
    itemBorder: "border-amber-200/90",
    itemHoverBorder: "hover:border-amber-400",
    itemTextColor: "text-amber-950 font-semibold",
    infoIconColor: "text-amber-400 hover:text-amber-600",
    emptyBg: "bg-white/60 border-amber-200/80",
    emptyText: "text-amber-500",
    scrollbarClass: "scrollbar-amber",
  },
  notImportantUrgent: {
    title: "3 - Not Important & Urgent",
    cardBg: "bg-sky-50/90 hover:bg-sky-50",
    border: "border-2 border-sky-300/90",
    headerBorder: "border-sky-200/80",
    badgeBg: "bg-sky-500 text-white font-bold shadow-xs",
    badgeText: "Q3",
    titleColor: "text-sky-950 font-extrabold",
 
    itemBg: "bg-white/90",
    itemBorder: "border-sky-200/90",
    itemHoverBorder: "hover:border-sky-400",
    itemTextColor: "text-sky-950 font-semibold",
    infoIconColor: "text-sky-400 hover:text-sky-600",
    emptyBg: "bg-white/60 border-sky-200/80",
    emptyText: "text-sky-500",
    scrollbarClass: "scrollbar-sky"
  },
  notImportantNotUrgent: {
    title: "4 - Not Important & Not Urgent",
    cardBg: "bg-purple-50/90 hover:bg-purple-50",
    border: "border-2 border-purple-300/90",
    headerBorder: "border-purple-200/80",
    badgeBg: "bg-purple-500 text-white font-bold shadow-xs",
    badgeText: "Q4",
    titleColor: "text-purple-950 font-extrabold",
  
    itemBg: "bg-white/90",
    itemBorder: "border-purple-200/90",
    itemHoverBorder: "hover:border-purple-400",
    itemTextColor: "text-purple-950 font-semibold",
    infoIconColor: "text-purple-400 hover:text-purple-600",
    emptyBg: "bg-white/60 border-purple-200/80",
    emptyText: "text-purple-400",
    scrollbarClass: "scrollbar-purple"
  },
};

interface QuadrantTaskItemProps{
  task: TaskModel;
  config: (typeof QUADRANT_CONFIG)[Exclude<TaskQuadrant, "empty">];
  onViewTask: (task: TaskModel) => void;
  onDeleteTask?: (taskId: string) => Promise<void> | void;
  onUpdateStatus?: (taskId: string, status: TaskStatus) => Promise<void> | void;
}

const QuadrantTaskItem: React.FC<QuadrantTaskItemProps> = ({task, config, onViewTask, onDeleteTask, onUpdateStatus}) =>{
  const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const getStatusBadge = (status: TaskStatus) => {
    switch (status) {
      case "inProgress":
        return {
          label: "In Progress",
          shortLabel: "In Progress",
          bg: "bg-purple-100 text-purple-700 hover:bg-purple-200 border-purple-200",
          dot: "bg-purple-500",
        };
      case "completed":
        return {
          label: "Completed",
          shortLabel: "Completed",
          bg: "bg-teal-100 text-teal-700 hover:bg-teal-200 border-teal-200",
          dot: "bg-teal-500",
        };
      case "pending":
      default:
        return {
          label: "Pending",
          shortLabel: "Pending",
          bg: "bg-amber-100 text-amber-700 hover:bg-amber-200 border-amber-200",
          dot: "bg-amber-500",
        };
    }
  };

  const statusBadge = getStatusBadge(task.status || "pending");

  const handleDelete = async (e: React.MouseEvent) =>{
    e.stopPropagation();
    if(!onDeleteTask) return;
    setIsDeleting(true);
    try{
      await onDeleteTask(task.id);
    } catch (err){
      console.error(err);
    } finally{
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };
  
  const handleSelectStatus = async (newStatus: TaskStatus, e: React.MouseEvent) => {
    e.stopPropagation();
    setIsStatusMenuOpen(false);
    if(onUpdateStatus && newStatus !== task.status){
      await onUpdateStatus(task.id, newStatus);
    }
  };

return (
    <div
      draggable={true}
      onDragStart={(e) => {
        e.dataTransfer.setData("text/plain", task.id);
        e.dataTransfer.effectAllowed = "move";
      }}
      className={`${config.itemBg} border ${config.itemBorder} ${config.itemHoverBorder} rounded-xl px-3 py-2 flex items-center justify-between gap-2 shadow-2xs hover:shadow-md transition-all cursor-grab active:cursor-grabbing select-none group relative`}
    >
      <div className="flex items-center gap-2 truncate flex-1 min-w-0">
        <span className={`text-xs ${config.itemTextColor} truncate flex-1`}>
          {task.title}
        </span>
      </div>

      {/* Action Buttons Row */}
      <div className="flex items-center gap-1.5 shrink-0 relative">
        {/* Status Quick Switcher Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsStatusMenuOpen((prev) => !prev);
            }}
            className={`text-[10px] font-bold px-2 py-0.5 rounded-md border flex items-center gap-1 transition-all cursor-pointer ${statusBadge.bg}`}
            title="Change Status without opening dialog"
            aria-label="Change Status"
          >
            <span className={`w-1.5 h-1.5 rounded-full ${statusBadge.dot}`} />
            <span>{statusBadge.shortLabel}</span>
            <svg
              className="w-3 h-3 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {/* Status Dropdown Menu */}
          {isStatusMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-20"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsStatusMenuOpen(false);
                }}
              />
              <div className="absolute right-0 top-full mt-1 z-30 bg-white rounded-xl shadow-lg border border-slate-200 py-1 w-32 flex flex-col gap-0.5 animate-in fade-in zoom-in-95 duration-100">
                <button
                  type="button"
                  onClick={(e) => handleSelectStatus("pending", e)}
                  className={`px-3 py-1.5 text-xs text-left font-semibold flex items-center gap-2 hover:bg-amber-50 hover:text-amber-700 transition-colors ${
                    task.status === "pending"
                      ? "text-amber-700 font-bold bg-amber-50/60"
                      : "text-slate-700"
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  Pending
                </button>
                <button
                  type="button"
                  onClick={(e) => handleSelectStatus("inProgress", e)}
                  className={`px-3 py-1.5 text-xs text-left font-semibold flex items-center gap-2 hover:bg-purple-50 hover:text-purple-700 transition-colors ${
                    task.status === "inProgress"
                      ? "text-purple-700 font-bold bg-purple-50/60"
                      : "text-slate-700"
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-purple-500" />
                  In Progress
                </button>
                <button
                  type="button"
                  onClick={(e) => handleSelectStatus("completed", e)}
                  className={`px-3 py-1.5 text-xs text-left font-semibold flex items-center gap-2 hover:bg-teal-50 hover:text-teal-700 transition-colors ${
                    task.status === "completed"
                      ? "text-teal-700 font-bold bg-teal-50/60"
                      : "text-slate-700"
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-teal-500" />
                  Completed
                </button>
              </div>
            </>
          )}
        </div>

        {/* Delete (Trash) Icon Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setShowDeleteConfirm(true);
          }}
          className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
          title="Delete Task"
          aria-label="Delete Task"
        >
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>

        {/* (i) Info Icon Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onViewTask(task);
          }}
          className={`${config.infoIconColor} p-1 rounded-md transition-colors cursor-pointer shrink-0`}
          title="View Task Details"
          aria-label="View Task Details"
        >
          <svg
            className="w-3.5 h-3.5"
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

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs"
          onClick={(e) => {
            e.stopPropagation();
            setShowDeleteConfirm(false);
          }}
        >
          <div
            className="bg-white rounded-2xl shadow-xl border border-slate-200 p-5 max-w-xs w-full flex flex-col items-center text-center gap-3 animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Delete Task?</h4>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-slate-700">
                  "{task.title}"
                </span>
                ?
              </p>
            </div>
            <div className="flex items-center gap-2 w-full mt-1">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDeleteConfirm(false);
                }}
                disabled={isDeleting}
                className="flex-1 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



export const Quadrant: React.FC<QuadrantProps> = ({
  quadrant,
  tasks,
  onViewTask,
  onDropTask,
  onDeleteTask,
  onUpdateStatus,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const dragCounterRef = useRef(0);
  const config =
    QUADRANT_CONFIG[quadrant as Exclude<TaskQuadrant, "empty">] ||
    QUADRANT_CONFIG.importantUrgent;

  // Filter tasks belonging to this quadrant
  const quadrantTasks = tasks.filter((t) => t.quadrant === quadrant);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    dragCounterRef.current += 1;
    if (dragCounterRef.current === 1) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    dragCounterRef.current -= 1;
    if (dragCounterRef.current === 0) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    dragCounterRef.current = 0;
    setIsDragOver(false);
    const taskId = e.dataTransfer.getData("text/plain");
    if (taskId && onDropTask) {
      onDropTask(taskId, quadrant);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`${config.cardBg} rounded-2xl p-4 border ${
        isDragOver
          ? "scale-[1.03] ring-4 ring-pink-500/50 border-pink-500 shadow-2xl z-10"
          : `${config.border} shadow-sm`
      } transition-all duration-200 flex flex-col justify-between gap-3 h-full`}
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

         
      </div>

      {/* Tasks List inside Quadrant with custom color-matched scrollbar */}
      <div
        className={`flex-1 flex flex-col gap-2 min-h-[140px] max-h-[180px] overflow-y-auto pr-1 ${config.scrollbarClass} justify-start`}
      >
        {quadrantTasks.length === 0 ? (
          <div
            className={`flex-1 flex items-center justify-center p-4 text-center text-xs ${config.emptyText} border border-dashed ${config.emptyBg} rounded-xl`}
          >
            No tasks in this quadrant
          </div>
        ) : (
          quadrantTasks.map((task) => (
            <QuadrantTaskItem
              key={task.id}
              task={task}
              config={config}
              onViewTask={onViewTask}
              onDeleteTask={onDeleteTask}
              onUpdateStatus={onUpdateStatus}
            />
          ))
        )}
      </div>
    </div>
  );
};

export const DashboardGrid = Quadrant;
export default Quadrant;
