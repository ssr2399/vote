import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported, type Analytics } from 'firebase/analytics';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

let analytics: Analytics | null = null;
isSupported().then(supported => {
    if (supported) analytics = getAnalytics(app);
});
export { analytics };

export const loginWithGoogle = () => {
    return signInWithPopup(auth, new GoogleAuthProvider());
};

export const logout = () => {
    return signOut(auth);
};
