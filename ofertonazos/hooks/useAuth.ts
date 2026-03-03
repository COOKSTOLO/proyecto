import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebase";

export function useAuth() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = doc(db, "users", firebaseUser.uid);
        const userSnapshot = await getDoc(userDoc);

        if (!userSnapshot.exists()) {
          await setDoc(userDoc, {
            uid: firebaseUser.uid,
            name: firebaseUser.displayName || "",
            email: firebaseUser.email || "",
            role: "user",
            subscriptionActive: false,
            createdAt: new Date(),
          });
        }

        setUser({ ...firebaseUser, ...userSnapshot.data() });
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return user;
}