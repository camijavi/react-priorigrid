import React, {useState} from 'react'
import type { TaskModel } from '../models/TaskModel'

export interface TaskCardProps {
  task: TaskModel;
  onEdit: (task: TaskModel) => void;
  onDelete: (taskId: string) => Promise<void> | void;
}

export const TaskCard: React.FC<TaskCardProps> = ({task, onEdit, onDelete}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);


  const getQuadrantInfo = (quadrant: string) => {
    switch (quadrant) {
      case "empty":
          return {
            label: "Unassigned",
            color: "bg-esmerald-100 text-esmerald-600 border-esmerald-200"
          }
      case "importantUrgent":
        return {
          label: "Q1: Important & Urgent",
          color: "bg-rose-50 text-rose-700 border-rose-200",
        };
      case "importantNotUrgent":
        return {
          label: "Q2: Important & Not Urgent",
          color: "bg-amber-50 text-amber-700 border-amber-200",
        };
      case "notImportantUrgent":
        return {
          label: "Q3: Not Important & Urgent",
          color: "bg-blue-50 text-blue-700 border-blue-200",
        };
      case "notImportantNotUrgent":
        return {
          label: "Q4: Not Important & Not Urgent",
          color: "bg-esmerald-100 text-esmerald-700 border-esmerald-200",
        };
      default:
        return {
          label: quadrant,
          color: "bg-esmerald-100 text-esmerald-700 border-esmerald-200",
        };
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "inprogress":
        return {
          label: "In Progress",
          color: "bg-purple-50 text-purple-700 border-purple-200",
        };
      case "completed":
        return {
          label: "Completed",
          color: "bg-esmerald-100 text-esmerald-500 border-esmerald-200",
        };
      case "pending":
      default:
        return {
          label: "Pending",
          color: "bg-emerald-50 text-emerald-700 border-emerald-200",
        };
    }
  }

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(task.id);
      setShowDeleteConfirm(false);
    } catch(error) {
      console.error("Failed to delete task: ", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const qInfo = getQuadrantInfo(task.quadrant);
  const sBadge = getStatusBadge(task.status);
    const formattedDueDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "No due date";

   return (
    <>
      {/* Main Task Card */}
      <div
        draggable={true}
        onDragStart={(e) => {
          setIsDragging(true);
          e.dataTransfer.setData("text/plain", task.id);
          e.dataTransfer.effectAllowed = "move";
        }}
        onDragEnd={() => {
          setIsDragging(false);
        }}
        className={`bg-esmerald-50/80 hover:bg-esmerald-50/40 rounded-xl p-5 border shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-4 group cursor-grab active:cursor-grabbing select-none ${
          isDragging
            ? "opacity-40 scale-95 border-pink-500 shadow-xl ring-2 ring-pink-400/50"
            : "border-esmerald-200/80 hover:border-pink-500/30"
        }`}
      >
        <div className="flex flex-col gap-3">
          {/* Header row: Quadrant info & Status */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-lg border ${qInfo.color}`}
            >
              {qInfo.label}
            </span>
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-md border ${sBadge.color}`}
            >
              {sBadge.label}
            </span>
          </div>

          {/* Title & Description */}
          <div>
            <h4 className="font-bold text-esmerald-900 text-base group-hover:text-pink-600 transition-colors line-clamp-2">
              {task.title}
            </h4>
            {task.description && (
              <p className="text-xs text-esmerald-500 mt-1 line-clamp-2">
                {task.description}
              </p>
            )}
          </div>
        </div>

        {/* Footer row: Due date & Action buttons */}
        <div className="pt-3 border-t border-esmerald-100 flex items-center justify-between text-xs text-esmerald-500">
          <div className="flex items-center gap-1.5 text-esmerald-400 font-medium">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.75}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span>{formattedDueDate}</span>
          </div>

          {/* Action buttons: Pen (Edit) and Trash (Delete) */}
          <div className="flex items-center gap-1">
            {/* Pen Icon (Edit) */}
            <button
              type="button"
              onClick={() => onEdit(task)}
              className="p-1.5 rounded-lg text-esmerald-500 hover:text-pink-600 hover:bg-pink-50 transition-colors cursor-pointer"
              title="Edit Task"
              aria-label="Edit Task"
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
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
            </button>

            {/* Trash Icon (Delete) */}
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="p-1.5 rounded-lg text-esmerald-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              title="Delete Task"
              aria-label="Delete Task"
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
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-esmerald-900/50 backdrop-blur-sm transition-opacity duration-200"
          onClick={() => setShowDeleteConfirm(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl border border-esmerald-200 w-full max-w-sm p-6 flex flex-col items-center text-center gap-4 transform transition-all duration-200 scale-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Trash warning icon badge */}
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shadow-sm">
              <svg
                className="w-6 h-6"
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
              <h3 className="text-lg font-bold text-esmerald-900">Delete Task?</h3>
              <p className="text-xs text-esmerald-500 mt-1.5 leading-relaxed">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-esmerald-800">"{task.title}"</span>
                ? This action cannot be undone.
              </p>
            </div>

            {/* Action buttons: Cancel & Accept */}
            <div className="flex items-center gap-3 w-full mt-2">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="flex-1 py-2.5 rounded-xl border border-esmerald-200 text-sm font-semibold text-esmerald-700 hover:bg-esmerald-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
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
                    Deleting...
                  </>
                ) : (
                  "Accept"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TaskCard