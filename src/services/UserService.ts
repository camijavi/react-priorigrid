import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile, type User } from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import type { UserModel } from "../models/UserModel";
import { auth, db } from "../firebase"
import firebase from "firebase/compat/app";

export class UserService {
    private static USER_COLLECTION = 'user';

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

        const userDocRef = doc(db, this.USER_COLLECTION, firebaseUser.uid);
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
            username: firebaseUser.displayName || email.split('@')[0],
            email: firebaseUser.email || email,
        }

    }







}