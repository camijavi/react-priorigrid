import {
    collection,
    doc,
    addDoc,
    getDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    Timestamp
} from "firebase/firestore";
import type { TaskModel, TaskQuadrant, TaskStatus } from "../models/TaskModel";
import { db } from "../firebase";



export class TaskService {
    private static TASKS_COLLECTION = "tasks";

    // Map firestore document data to task model 
    private static formatTaskDoc(id: string, data: any): TaskModel {
        return {
            id,
            userId: data.userId || data.userid || "",
            title: data.title || "",
            description: data.description || "",
            status: (data.status as TaskStatus) || "pending",
            quadrant: (data.quadrant as TaskQuadrant) || "importantUrgent",
            position: typeof data.position === "number" ? data.position : 0,
            dueDate: data.dueDate instanceof Timestamp
                ? data.dueDate.toDate()
                : data.dueDate
                    ? new Date(data.dueDate)
                    : new Date(),
        };
    }

    // create new task in firebase

    static async createTask(task: Omit<TaskModel, "id">): Promise<TaskModel> {
        const tasksRef = collection(db, this.TASKS_COLLECTION);

        const payload = {
            userId: task.userId,
            title: task.title,
            description: task.description,
            status: task.status,
            quadrant: task.quadrant,
            position: task.position,
            dueDate: task.dueDate ? Timestamp.fromDate(new Date(task.dueDate)) : Timestamp.now(),
        }

        const docRef = await addDoc(tasksRef, payload);

        return {
            id: docRef.id,
            ...task,
            dueDate: task.dueDate ? new Date(task.dueDate) : new Date(),
        }
    }

    // fetch task per user 

    static async getTaskByUserId(userId: string): Promise<TaskModel[]> {
        const tasksRef = collection(db, this.TASKS_COLLECTION);

        const q = query(
            tasksRef,
            where("userId", "==", userId),
            orderBy("position", "asc")
        );

        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map((docSnap) => this.formatTaskDoc(docSnap.id, docSnap.data()));
    }



}



