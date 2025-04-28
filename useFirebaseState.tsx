// syncState.js
import { useEffect, useState } from "react";
import {
  signInUser,
  getUserData,
  setUserData,
  listenToUserProgress,
} from "./config";

const useFirebaseState = () => {
  const [userId, setUserId] = useState(null);
  const [userData, setUserDataState] = useState({});

  useEffect(() => {
    // Sign in or get the current user ID
    const fetchUserId = async () => {
      const uid = await signInUser();
      setUserId(uid);
    };
    fetchUserId();
  }, []);

  useEffect(() => {
    if (userId) {
      // Get user data from Firebase
      const fetchUserData = async () => {
        const data = await getUserData(userId);
        if (data) {
          setUserDataState(data);
        }
      };
      fetchUserData();

      // Set up real-time listener for progress updates
      listenToUserProgress(userId, (data) => {
        setUserDataState(data);
      });
    }
  }, [userId]);

  const syncWithFirebase = async (newData) => {
    if (userId) {
      // Sync state with Firebase
      await setUserData(userId, newData);
    }
  };

  return { userData, syncWithFirebase };
};

export default useFirebaseState;
