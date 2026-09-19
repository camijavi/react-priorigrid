import React, { useState, useRef } from "react";
import type { TaskModel, TaskQuadrant, TaskStatus } from "../models/TaskModel";
import { TaskCard } from "./taskCard";

export interface TaskContainerProps {
  tasks: TaskModel[];
  isLoadingTasks: boolean;
  onOpenCreateDialog: () => void;
  onOpenEditDialog: (task: TaskModel) => void;
  onDeleteTask: (taskId: string) => Promise<void> | void;
  onDropTask?: (taskId: string, targetQuadrant: TaskQuadrant) => void;
  className?: string;
}

export const TaskContainer: React.FC<TaskContainerProps> = ({
  tasks,
  isLoadingTasks,
  onOpenCreateDialog,
  onOpenEditDialog,
  onDeleteTask,
  onDropTask,
  className = "",
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const dragCounterRef = useRef(0);

  const containerTasks = tasks.filter(
    (t) => t.quadrant === "empty" || t.position === 0 || !t.quadrant
  );

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
      onDropTask(taskId, "empty");
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`bg-white rounded-2xl p-6 border transition-all duration-200 flex flex-col gap-6 h-full flex-1 ${
        isDragOver
          ? "ring-4 ring-pink-500/50 border-pink-500 shadow-2xl scale-[1.01]"
          : "border-slate-200 shadow-sm"
      } ${className}`}
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900">
            Your Tasks ({containerTasks.length})
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            All your unassigned tasks ready to be placed into quadrants.
          </p>
        </div>
        <button
          onClick={onOpenCreateDialog}
          className="px-3.5 py-2 bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold rounded-xl shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
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
              strokeWidth={2.5}
              d="M12 4v16m8-8H4"
            />
          </svg>
           
        </button>
      </div>

      {/* Scrollable Body Content */}
      <div className="overflow-y-auto max-h-[500px] pr-1.5 scrollbar-pink flex flex-col">
        {isLoadingTasks ? (
          <div className="p-12 text-center text-slate-500 flex flex-col items-center justify-center gap-2 flex-1">
            <svg
              className="w-8 h-8 animate-spin text-pink-500"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span className="text-sm font-medium">Loading your tasks...</span>
          </div>
        ) : containerTasks.length === 0 ? (
          <div className="p-10 text-center border border-dashed border-slate-200 bg-slate-50/50 rounded-2xl flex flex-col items-center justify-center gap-3 flex-1">
            <div className="w-14 h-14 rounded-2xl bg-pink-50 text-pink-500 flex items-center justify-center">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-lg">No unassigned tasks</h4>
              <p className="text-slate-500 text-sm max-w-md mt-1">
                All tasks are currently assigned to matrix quadrants, or click <strong>"+"</strong> to add a new task.
              </p>
            </div>
            
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {containerTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={onOpenEditDialog}
                onDelete={onDeleteTask}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskContainer;
