import React, { useState, useEffect } from "react";
import type { TaskModel, TaskQuadrant, TaskStatus } from "../models/TaskModel";

export interface NewEditTaskDialogProps {
  isOpen: boolean;
  taskToEdit?: TaskModel | null;
  userId?: string;
  onClose: () => void;
  onSave: (taskData: Omit<TaskModel, "id"> | TaskModel) => Promise<void> | void;
}

const QUADRANT_POSITION_MAP: Record<TaskQuadrant, number> = {
  importantUrgent: 1,
  importantNotUrgent: 2,
  notImportantUrgent: 3,
  notImportantNotUrgent: 4,
};

export const NewEditTaskDialog: React.FC<NewEditTaskDialogProps> = ({
  isOpen,
  taskToEdit,
  userId = "",
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatus>("pending");
  const [quadrant, setQuadrant] = useState<TaskQuadrant>("importantUrgent");
  const [dueDate, setDueDate] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{
    title?: string;
    dueDate?: string;
    status?: string;
    quadrant?: string;
  }>({});

  const formatDateToInput = (dateObj: Date): string => {
    const d = new Date(dateObj);
    if (isNaN(d.getTime())) return new Date().toISOString().split("T")[0];
    return d.toISOString().split("T")[0];
  };

  useEffect(() => {
    if (isOpen) {
      setErrors({});
      if (taskToEdit) {
        setTitle(taskToEdit.title || "");
        setDescription(taskToEdit.description || "");
        setStatus(taskToEdit.status || "pending");
        setQuadrant(taskToEdit.quadrant || "importantUrgent");
        setDueDate(
          taskToEdit.dueDate
            ? formatDateToInput(new Date(taskToEdit.dueDate))
            : new Date().toISOString().split("T")[0]
        );
      } else {
        setTitle("");
        setDescription("");
        setStatus("pending");
        setQuadrant("importantUrgent");
        setDueDate(new Date().toISOString().split("T")[0]);
      }
    }
  }, [isOpen, taskToEdit]);

  if (!isOpen) return null;

  const currentPosition = QUADRANT_POSITION_MAP[quadrant] || 1;

  const validateForm = () => {
    const newErrors: {
      title?: string;
      dueDate?: string;
      status?: string;
      quadrant?: string;
    } = {};

    if (!title.trim()) {
      newErrors.title = "Task title is required.";
    }

    if (!dueDate) {
      newErrors.dueDate = "Due date is required.";
    }

    if (!status) {
      newErrors.status = "Status is required.";
    }

    if (!quadrant) {
      newErrors.quadrant = "Quadrant is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const taskPayload = {
        userId,
        title: title.trim(),
        description: description.trim(),
        status,
        quadrant,
        position: currentPosition,
        dueDate: new Date(dueDate),
      };

      if (taskToEdit) {
        await onSave({
          ...taskToEdit,
          ...taskPayload,
        });
      } else {
        await onSave(taskPayload);
      }
      onClose();
    } catch (error) {
      console.error("Failed to save task:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm transition-opacity duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col transform transition-all duration-200 scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 via-pink-500 to-rose-500 flex items-center justify-center text-white font-bold shadow-md">
              {taskToEdit ? (
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
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
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
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                {taskToEdit ? "Edit Task" : "Create New Task"}
              </h2>
              <p className="text-xs text-slate-500">
                {taskToEdit
                  ? "Update task details and priority settings."
                  : "Fill in task details to organize your priority grid."}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-2 rounded-xl hover:bg-slate-200/60 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4 bg-white">
          {/* Title Field */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Title <span className="text-pink-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Complete quarterly roadmap report"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) {
                  setErrors((prev) => ({ ...prev, title: undefined }));
                }
              }}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 bg-slate-50/70 focus:bg-white focus:outline-none transition-all ${
                errors.title
                  ? "border-rose-400 bg-rose-50/50 text-slate-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                  : "border-slate-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
              }`}
            />
            {errors.title && (
              <p className="mt-1.5 text-xs font-semibold text-rose-600 flex items-center gap-1.5">
                <svg
                  className="w-4 h-4 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {errors.title}
              </p>
            )}
          </div>

          {/* Description Field (Optional) */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Description <span className="text-slate-400 font-normal lowercase">(optional)</span>
            </label>
            <textarea
              rows={3}
              placeholder="Add key context, notes, or acceptance criteria..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 bg-slate-50/70 focus:bg-white focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all resize-none"
            />
          </div>

          {/* Status & Quadrant Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Status Dropdown */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Status <span className="text-pink-500">*</span>
              </label>
              <select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value as TaskStatus);
                  if (errors.status) {
                    setErrors((prev) => ({ ...prev, status: undefined }));
                  }
                }}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 bg-slate-50/70 focus:bg-white focus:outline-none transition-all ${
                  errors.status
                    ? "border-rose-400 bg-rose-50/50 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                    : "border-slate-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
                }`}
              >
                <option value="pending">Pending</option>
                <option value="inprogress">In Progress</option>
                <option value="archived">Archived</option>
              </select>
              {errors.status && (
                <p className="mt-1.5 text-xs font-semibold text-rose-600 flex items-center gap-1.5">
                  <svg
                    className="w-4 h-4 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {errors.status}
                </p>
              )}
            </div>

            {/* Quadrant Dropdown */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Quadrant <span className="text-pink-500">*</span>
              </label>
              <select
                value={quadrant}
                onChange={(e) => {
                  setQuadrant(e.target.value as TaskQuadrant);
                  if (errors.quadrant) {
                    setErrors((prev) => ({ ...prev, quadrant: undefined }));
                  }
                }}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 bg-slate-50/70 focus:bg-white focus:outline-none transition-all ${
                  errors.quadrant
                    ? "border-rose-400 bg-rose-50/50 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                    : "border-slate-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
                }`}
              >
                <option value="importantUrgent">1 - Important & Urgent</option>
                <option value="importantNotUrgent">2 - Important & Not Urgent</option>
                <option value="notImportantUrgent">3 - Not Important & Urgent</option>
                <option value="notImportantNotUrgent">4 - Not Important & Not Urgent</option>
              </select>
              {errors.quadrant && (
                <p className="mt-1.5 text-xs font-semibold text-rose-600 flex items-center gap-1.5">
                  <svg
                    className="w-4 h-4 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {errors.quadrant}
                </p>
              )}
            </div>
          </div>

          {/* Position & Due Date Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Position Indicator */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Position <span className="text-slate-400 font-normal lowercase">(auto position)</span>
              </label>
              <div className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 bg-slate-100/80 flex items-center justify-between">
                <span>Quadrant Position #{currentPosition}</span>
                <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-pink-100 text-pink-700 border border-pink-200">
                  P{currentPosition}
                </span>
              </div>
            </div>

            {/* Due Date Field */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Due Date <span className="text-pink-500">*</span>
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => {
                  setDueDate(e.target.value);
                  if (errors.dueDate) {
                    setErrors((prev) => ({ ...prev, dueDate: undefined }));
                  }
                }}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 bg-slate-50/70 focus:bg-white focus:outline-none transition-all ${
                  errors.dueDate
                    ? "border-rose-400 bg-rose-50/50 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                    : "border-slate-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
                }`}
              />
              {errors.dueDate && (
                <p className="mt-1.5 text-xs font-semibold text-rose-600 flex items-center gap-1.5">
                  <svg
                    className="w-4 h-4 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {errors.dueDate}
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-gradient-to-r from-orange-500 via-pink-500 to-rose-500 hover:from-orange-600 hover:via-pink-600 hover:to-rose-600 text-white text-sm font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-150 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
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
                  Saving...
                </>
              ) : taskToEdit ? (
                "Save Changes"
              ) : (
                "Create Task"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewEditTaskDialog;
