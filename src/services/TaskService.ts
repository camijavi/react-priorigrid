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
            quadrant: (data.quadrant as TaskQuadrant) || "empty",
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

    static async getTasksByUserId(userId: string): Promise<TaskModel[]> {
        const tasksRef = collection(db, this.TASKS_COLLECTION);

        const q = query(
            tasksRef,
            where("userId", "==", userId)
        );

        const querySnapshot = await getDocs(q);
        const tasks = querySnapshot.docs.map((docSnap) => this.formatTaskDoc(docSnap.id, docSnap.data()))
        return tasks.sort((a, b) => a.position - b.position);
    }

    static async getTaskById(taskId: string): Promise<TaskModel | null> {
        const taskDocRef = doc(db, this.TASKS_COLLECTION, taskId);
        const docSnap = await getDoc(taskDocRef);

        if (!docSnap.exists()) {
            return null;
        }

        return this.formatTaskDoc(docSnap.id, docSnap.data());
    }

    static async updateTask(taskId: string, data: Partial<Omit<TaskModel, "id">>): Promise<void> {
        const taskDocRef = doc(db, this.TASKS_COLLECTION, taskId);

        const updateData: Record<string, any> = { ...data };
        if (data.dueDate) {
            updateData.dueDate = Timestamp.fromDate(new Date(data.dueDate));

            await updateDoc(taskDocRef, updateData);
        }
    }

    static async deleteTask(taskId: string): Promise<void> {
        const taskDocRef = doc(db, this.TASKS_COLLECTION, taskId);
        await deleteDoc(taskDocRef)
    }

    static async getTaskByQuadrant(userId: string, quadrant: TaskQuadrant): Promise<TaskModel[]> {
        const tasksRef = collection(db, this.TASKS_COLLECTION);
        const q = query(
            tasksRef,
            where("userId", "==", userId),
            where("quadrant", "==", quadrant)
        )

        const querySnapshot = await getDocs(q)
        const tasks = querySnapshot.docs.map((docSnap) => this.formatTaskDoc(docSnap.id, docSnap.data()))
        return tasks.sort((a, b) => a.position - b.position);
    }

    static async getTasksByStatus(userId: string, status: TaskStatus): Promise<TaskModel[]> {
        const tasksRef = collection(db, this.TASKS_COLLECTION);
        const q = query(
            tasksRef,
            where("userId", "==", userId),
            where("status", "==", status)
        )

        const querySnapshot = await getDocs(q);
        const tasks = querySnapshot.docs.map((docSnap) => this.formatTaskDoc(docSnap.id, docSnap.data()))
        return tasks.sort((a, b) => a.position - b.position);
    }
}



