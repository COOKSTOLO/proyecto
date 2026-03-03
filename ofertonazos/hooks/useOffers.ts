import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../lib/firebase";

export function useOffers() {
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    const offersQuery = query(
      collection(db, "offers"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(offersQuery, (snapshot) => {
      const offersData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOffers(offersData);
    });

    return () => unsubscribe();
  }, []);

  return offers;
}