import { db } from "../../../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export async function POST(request: Request) {
  const body = await request.json();

  try {
    const docRef = await addDoc(collection(db, "offers"), {
      ...body,
      createdAt: serverTimestamp(),
    });

    return NextResponse.json({ id: docRef.id, message: "Offer created successfully" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}