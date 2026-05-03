import { useState, useEffect } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db, loginWithGoogle, logout as firebaseLogout } from "../services/firebaseService";

export interface UserVoterProfile {
    uid: string;
    address: string;
    isRegistered: boolean;
    idReady: boolean;
    pollingBoothKnown: boolean;
    updatedAt: number;
}

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserVoterProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                const docRef = doc(db, "users", currentUser.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setProfile(docSnap.data() as UserVoterProfile);
                } else {
                    const newProfile: UserVoterProfile = {
                        uid: currentUser.uid,
                        address: "",
                        isRegistered: false,
                        idReady: false,
                        pollingBoothKnown: false,
                        updatedAt: Date.now()
                    };
                    await setDoc(docRef, {
                        ...newProfile,
                        updatedAt: serverTimestamp()
                    });
                    setProfile(newProfile);
                }
            } else {
                setProfile(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const login = async () => {
        setLoading(true);
        try {
            await loginWithGoogle();
        } catch (_error) {
            // Auth failed — reset loading state without leaking error details
            setLoading(false);
        }
    };

    const logout = async () => {
        await firebaseLogout();
    }

    const updateProfile = async (updates: Partial<UserVoterProfile>) => {
        if (!user || !profile) return;
        const newProfile = { ...profile, ...updates, updatedAt: Date.now() };
        setProfile(newProfile);
        
        await setDoc(doc(db, "users", user.uid), {
            ...updates,
            updatedAt: serverTimestamp()
        }, { merge: true });
    }

    return { user, profile, loading, login, logout, updateProfile };
};
