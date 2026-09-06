export interface TaskModel {
    id: string;
    userId: string;
    title: string;
    desription: string;
    status: string;
    quadrant: string;
    position: number;
    dueDate: Date;
}