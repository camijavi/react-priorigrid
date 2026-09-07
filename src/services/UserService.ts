import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile, type User } from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import type { UserModel } from "../models/UserModel";
import { auth, db } from "../firebase"


export class UserService {
    private static USERS_COLLECTION = 'user';

    /**
     * @param email
     * @param password
     * @param username
     */

    static async register(email: string, password: string, username: string): Promise<UserModel> {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const firebaseUser: User = userCredential.user;

        await updateProfile(firebaseUser, { displayName: username });

        const userProfile: UserModel = {
            id: firebaseUser.uid,
            username,
            email,
        };

        const userDocRef = doc(db, this.USERS_COLLECTION, firebaseUser.uid);
        await setDoc(userDocRef, userProfile);

        return userProfile;
    }

    /**
    * @param email
    * @param password
    */

    static async login(email: string, password: string): Promise<UserModel> {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const firebaseUser: User = userCredential.user;

        const profile = await this.getUserById(firebaseUser.uid);
        if (profile) {
            return profile;
        }

        const fallbackProfile: UserModel = {
            id: firebaseUser.uid,
            username: firebaseUser.displayName || email.split("@")[0],
            email: firebaseUser.email || email,
        };

        return fallbackProfile;
    }

    static async logout(): Promise<void> {
        await signOut(auth);
    }

    static async getUserById(uid: string): Promise<UserModel | null> {
        const userDocRef = doc(db, this.USERS_COLLECTION, uid);
        const docSnap = await getDoc(userDocRef);

        if (!docSnap.exists()) {
            return null;
        }

        const data = docSnap.data();
        return {
            id: docSnap.id,
            username: data.username,
            email: data.email,
        }
    }

    static async updateUserProfile(uid: string, data: Partial<Omit<UserModel, "id">>): Promise<void> {
        const userDocRef = doc(db, this.USERS_COLLECTION, uid);
        await updateDoc(userDocRef, data)
    }









}