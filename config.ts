import { initializeApp } from "firebase/app";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  onSnapshot,
} from "firebase/firestore";
import { getAuth, signInAnonymously } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyALEAnPBc_bochJB844__io7zdHbpXkwYw",
  authDomain: "catbell-c7768.firebaseapp.com",
  projectId: "catbell-c7768",
  storageBucket: "catbell-c7768.firebasestorage.app",
  messagingSenderId: "772007145045",
  appId: "1:772007145045:web:6ca70814c7b6989d1faedc",
  measurementId: "G-V5XVV69GDQ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Create a new user or use anonymous sign-in
const signInUser = async () => {
  const userCredential = await signInAnonymously(auth);
  return userCredential.user.uid;
};

// Get user data from Firestore
const getUserData = async (userId) => {
  const docRef = doc(db, "users", userId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    console.log("No such document!");
    return null;
  }
};

// Set user data in Firestore
const setUserData = async (userId, data) => {
  const docRef = doc(db, "users", userId);
  await setDoc(docRef, data, { merge: true });
};

// Listen for real-time updates
const listenToUserProgress = (userId, callback) => {
  const docRef = doc(db, "users", userId);
  onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data());
    }
  });
};

export { db, signInUser, getUserData, setUserData, listenToUserProgress };
