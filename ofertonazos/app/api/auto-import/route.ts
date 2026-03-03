import { NextResponse } from "next/server";
import { db } from "../../../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export async function POST(request: Request) {
  const offers = await request.json();

  try {
    const batch = offers.map((offer: any) =>
      addDoc(collection(db, "offers"), {
        ...offer,
        createdAt: serverTimestamp(),
      })
    );

    await Promise.all(batch);

    return NextResponse.json({ message: "Offers imported successfully" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}