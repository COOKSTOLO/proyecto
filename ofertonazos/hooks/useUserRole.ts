import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

export function useUserRole(uid: string) {
  const [role, setRole] = useState("user");

  useEffect(() => {
    const fetchRole = async () => {
      const userDoc = doc(db, "users", uid);
      const userSnapshot = await getDoc(userDoc);
      if (userSnapshot.exists()) {
        setRole(userSnapshot.data().role);
      }
    };

    if (uid) {
      fetchRole();
    }
  }, [uid]);

  return role;
}