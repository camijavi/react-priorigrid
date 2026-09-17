import React, { useState, useEffect, useCallback } from "react";
import { TaskService } from "../services/TaskService";
import type { UserModel } from "../models/UserModel";
import type { TaskModel, TaskQuadrant } from "../models/TaskModel";
import { NewEditTaskDialog } from "../components/newEditTaskDialog";
import { TaskContainer } from "../components/TaskContainer";
import { MatrixContainer } from "../components/MatrixContainer";
import { Navbar } from "../components/Navbar";

const QUADRANT_POSITION_MAP: Record<TaskQuadrant, number> = {
  empty:0,
  importantUrgent: 1,
  importantNotUrgent: 2,
  notImportantUrgent: 3,
  notImportantNotUrgent: 4,
};

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
  const [taskToView, setTaskToView] = useState<TaskModel | null>(null);
  const [tasks, setTasks] = useState<TaskModel[]>([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

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

  const handleOpenCreateDialog = () => {
    setTaskToEdit(null);
    setIsDialogOpen(true);
  };

  const handleOpenEditDialog = (task: TaskModel) => {
    setTaskToEdit(task);
    setIsDialogOpen(true);
  };

  const handleViewTask = (task: TaskModel) => {
    setTaskToView(task);
    setIsViewDialogOpen(true);
  };

  const handleCloseViewDialog = () => {
    setIsViewDialogOpen(false);
    setTaskToView(null);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setTaskToEdit(null);
  };

  const handleSaveTask = async (
    taskData: Omit<TaskModel, "id"> | TaskModel,
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

  const handleDropTaskOnQuadrant = async (
    taskId: string,
    targetQuadrant: TaskQuadrant
  ) => {
    const targetTask = tasks.find((t) => t.id === taskId);
    if (!targetTask || targetTask.quadrant === targetQuadrant) return;

    const newPosition = QUADRANT_POSITION_MAP[targetQuadrant] || 1;

    // Optimistic local state update for zero-lag drag feedback
    setTasks((prevTasks) =>
      prevTasks.map((t) =>
        t.id === taskId
          ? { ...t, quadrant: targetQuadrant, position: newPosition }
          : t
      )
    );

    try {
      await TaskService.updateTask(taskId, {
        quadrant: targetQuadrant,
        position: newPosition,
      });
    } catch (error) {
      console.error("Failed to update task quadrant on drop:", error);
      await fetchTasks();
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800 flex flex-col relative">
      {/* Top Navbar */}
      <Navbar
        user={user}
        onOpenCreateDialog={handleOpenCreateDialog}
        onLogout={onLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-8 max-w-[1800px] w-full mx-auto flex flex-col gap-6">
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

        {/* 2-Column Grid Layout: TaskContainer (Left) & MatrixContainer (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          <div className="lg:col-span-4 flex flex-col">
            <TaskContainer
              tasks={tasks}
              isLoadingTasks={isLoadingTasks}
              onOpenCreateDialog={handleOpenCreateDialog}
              onOpenEditDialog={handleOpenEditDialog}
              onDeleteTask={handleDeleteTask}
            />
          </div>
          <div className="lg:col-span-8 flex flex-col">
            <MatrixContainer tasks={tasks} onViewTask={handleViewTask} onDropTask={handleDropTaskOnQuadrant} />
          </div>
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

      {/* View Task Details Modal (Read-Only) */}
      <NewEditTaskDialog
        isOpen={isViewDialogOpen}
        taskToEdit={taskToView}
        isReadOnly={true}
        userId={user?.id || ""}
        onClose={handleCloseViewDialog}
        onSave={() => {}}
      />
    </div>
  );
};

export default DashboardScreen;
