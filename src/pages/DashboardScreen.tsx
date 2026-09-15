import React, { useState, useEffect, useCallback } from "react";
import { UserService } from "../services/UserService";
import { TaskService } from "../services/TaskService";
import type { UserModel } from "../models/UserModel";
import type { TaskModel } from "../models/TaskModel";
import prioriGridLogo from "../assets/prioriGridLogo.png";
import { NewEditTaskDialog } from "../components/newEditTaskDialog";
import { TaskCard } from "../components/taskCard";

interface DashboardScreenProps {
  user?: UserModel | null;
  onLogout?: () => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  user,
  onLogout,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<TaskModel | null>(null);
  const [tasks, setTasks] = useState<TaskModel[]>([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);

  const fetchTasks = useCallback(async () => {
    if (!user?.id) return;
    setIsLoadingTasks(true);
    try {
      const userTasks = await TaskService.getTasksByUserId(user.id);
      setTasks(userTasks);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    } finally {
      setIsLoadingTasks(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleSignOut = async () => {
    try {
      await UserService.logout();
      if (onLogout) {
        onLogout();
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleOpenCreateDialog = () => {
    setTaskToEdit(null);
    setIsDialogOpen(true);
  };

  const handleOpenEditDialog = (task: TaskModel) => {
    setTaskToEdit(task);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setTaskToEdit(null);
  };

  const handleSaveTask = async (
    taskData: Omit<TaskModel, "id"> | TaskModel
  ) => {
    if ("id" in taskData && taskData.id) {
      // Edit mode
      await TaskService.updateTask(taskData.id, taskData);
    } else {
      // Create mode
      await TaskService.createTask(taskData as Omit<TaskModel, "id">);
    }
    await fetchTasks();
  };

  const handleDeleteTask = async (taskId: string) => {
    await TaskService.deleteTask(taskId);
    await fetchTasks();
  };

  const getQuadrantLabel = (quadrant: string) => {
    switch (quadrant) {
      case "importantUrgent":
        return { label: "Q1: Important & Urgent", color: "bg-rose-100 text-rose-700 border-rose-200" };
      case "importantNotUrgent":
        return { label: "Q2: Important & Not Urgent", color: "bg-amber-100 text-amber-700 border-amber-200" };
      case "notImportantUrgent":
        return { label: "Q3: Not Important & Urgent", color: "bg-blue-100 text-blue-700 border-blue-200" };
      case "notImportantNotUrgent":
        return { label: "Q4: Not Important & Not Urgent", color: "bg-slate-100 text-slate-700 border-slate-200" };
      default:
        return { label: quadrant, color: "bg-slate-100 text-slate-700 border-slate-200" };
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800 flex flex-col relative">
      {/* Top Navbar */}
      <header className="bg-white shadow-sm border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <img
            src={prioriGridLogo}
            alt="PrioriGrid Logo"
            className="w-10 h-10 object-contain rounded-xl"
          />
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              PrioriGrid Dashboard
            </h1>
            <p className="text-xs text-slate-500">
              Welcome back, {user?.username || user?.email || "User"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Add Task Button in Navbar */}
          <button
            onClick={handleOpenCreateDialog}
            className="px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white text-sm font-bold rounded-lg shadow-md shadow-pink-500/20 transition-all flex items-center gap-2 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
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
                strokeWidth={2.5}
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span>New Task</span>
          </button>

          <button
            onClick={handleSignOut}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-sm font-semibold rounded-lg shadow transition-colors cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-6 max-w-7xl w-full mx-auto flex flex-col gap-6">
        {/* Welcome Header & Quick Action Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Welcome to your Dashboard!
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              Organize your tasks efficiently across priority quadrants.
            </p>
          </div>

          <button
            onClick={handleOpenCreateDialog}
            className="self-start sm:self-auto px-5 py-3 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold rounded-xl shadow-lg shadow-pink-500/25 transition-all flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>
            <span>Create Task</span>
          </button>
        </div>

        {/* Main Tasks Container Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Your Tasks ({tasks.length})
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                All your scheduled and priority items in one place.
              </p>
            </div>
            <button
              onClick={handleOpenCreateDialog}
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
              <span>Add Task</span>
            </button>
          </div>

          {isLoadingTasks ? (
            <div className="p-12 text-center text-slate-500 flex flex-col items-center justify-center gap-2">
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
          ) : tasks.length === 0 ? (
            <div className="p-10 text-center border border-dashed border-slate-200 bg-slate-50/50 rounded-2xl flex flex-col items-center gap-3">
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
                <h4 className="font-bold text-slate-900 text-lg">No tasks yet</h4>
                <p className="text-slate-500 text-sm max-w-md mt-1">
                  Click the <strong>"+"</strong> button to add your first priority task and start organizing your workflow.
                </p>
              </div>
              <button
                onClick={handleOpenCreateDialog}
                className="mt-2 px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white font-semibold text-sm rounded-xl transition-colors cursor-pointer"
              >
                + Add First Task
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={handleOpenEditDialog}
                  onDelete={handleDeleteTask}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* New/Edit Task Dialog Modal */}
      <NewEditTaskDialog
        isOpen={isDialogOpen}
        taskToEdit={taskToEdit}
        userId={user?.id || ""}
        onClose={handleCloseDialog}
        onSave={handleSaveTask}
      />
    </div>
  );
};

export default DashboardScreen;
