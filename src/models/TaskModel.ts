export type TaskStatus = "pending" | "inProgress" | "completed";

export type TaskQuadrant =
    | "importantUrgent"
    | "importantNotUrgent"
    | "notImportantUrgent"
    | "notImportantNotUrgent";

export interface TaskModel {
    id: string;
    userId: string;
    title: string;
    description: string;
    status: TaskStatus;
    quadrant: TaskQuadrant;
    position: number;
    dueDate: Date;
}