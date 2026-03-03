import { db } from "../../../lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { userId, subscriptionActive } = await request.json();

  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, { subscriptionActive });

    return NextResponse.json({ message: "Subscription updated successfully" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}