import React from "react";
import type { TaskModel, TaskQuadrant, TaskStatus } from "../models/TaskModel";
import { Quadrant } from "./dashboardGrid";

export interface MatrixContainerProps {
  tasks?: TaskModel[];
  onViewTask?: (task: TaskModel) => void;
  onDropTask?: (taskId: string, targetQuadrant: TaskQuadrant) => void;
  onDeleteTask?: (taskId:string) => Promise<void> | void;
  onUpdateStatus?: (taskId: string, status: TaskStatus) => Promise<void> | void;
  className?: string;
}

const QUADRANTS: TaskQuadrant[] = [
  "importantUrgent",
  "importantNotUrgent",
  "notImportantUrgent",
  "notImportantNotUrgent",
];

export const MatrixContainer: React.FC<MatrixContainerProps> = ({
  tasks = [],
  onViewTask = () => {},
  onDropTask,
  onDeleteTask,
  onUpdateStatus,
  className = "",
}) => {
  return (
    <div
      className={`bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col gap-6 ${className}`}
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Your Priority Grid</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            A visual breakdown of what needs your attention right now.
          </p>
        </div>
      </div>

      {/* 2x2 Matrix Grid of Quadrant Squares */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
        {QUADRANTS.map((quadrant) => (
          <Quadrant
            key={quadrant}
            quadrant={quadrant}
            tasks={tasks}
            onViewTask={onViewTask}
            onDropTask={onDropTask}
            onDeleteTask={onDeleteTask} 
            onUpdateStatus={onUpdateStatus}
          />
        ))}
      </div>
    </div>
  );
};

export default MatrixContainer;
