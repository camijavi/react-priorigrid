import React, {useState, useEffect} from 'react'
import type { TaskModel, TaskQuadrant, TaskStatus } from '../models/TaskModel'

export interface newEditTaskDialogProps {
  isOpen: boolean;
  taskToEdit?: TaskModel | null;
  userId?: string;
  onClose: () => void;
  onSave: (taskData: Omit<TaskModel, "id"> | TaskModel) => Promise<void> | void;

}

const QUADRAN_PSOITION_MAP: Record<TaskQuadrant, number> = {
  importantUrgent: 1,
  importantNotUrgent: 2,
  notImportantUrgent: 3,
  notImportantNotUrgent: 4,
}




 export const newEditTaskDialog: React.FC<newEditTaskDialogProps> = ({isOpen, taskToEdit, userId="", onClose, onSave}) => {
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatus>("pending");
  const [quadrant, setQuadrant] = useState<TaskQuadrant>("importantUrgent");
  const [dueDate, setDueDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [erros, setErrors] = useState<{
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

  return (
    <div>newEditTaskDialog</div>
  )
}

export default newEditTaskDialog