import { db } from "../../../lib/firebase";
import { doc, deleteDoc } from "firebase/firestore";

export async function DELETE(request: Request) {
  const { id } = await request.json();

  try {
    const offerRef = doc(db, "offers", id);
    await deleteDoc(offerRef);

    return NextResponse.json({ message: "Offer deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}