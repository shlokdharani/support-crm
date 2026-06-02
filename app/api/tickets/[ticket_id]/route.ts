import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../lib/firebase";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  Timestamp,
} from "firebase/firestore";

// Helper: find a Firestore doc by ticketId field
async function findDocByTicketId(ticket_id: string) {
  const q = query(
    collection(db, "tickets"),
    where("ticketId", "==", ticket_id)
  );
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  const docSnap = snapshot.docs[0];
  return { ref: doc(db, "tickets", docSnap.id), data: docSnap.data() };
}

// GET /api/tickets/{ticket_id}
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ ticket_id: string }> }
) {
  try {
    const { ticket_id } = await params;
    const result = await findDocByTicketId(ticket_id);

    if (!result) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    const data = result.data;

    return NextResponse.json({
      ticket_id: data.ticketId,
      customer_name: data.customerName,
      customer_email: data.customerEmail,
      subject: data.subject,
      description: data.description,
      status: data.status,
      notes: data.notes ?? [],
    });
  } catch (error) {
    console.error("[GET /api/tickets/:ticket_id]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT /api/tickets/{ticket_id}
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ ticket_id: string }> }
) {
  try {
    const { ticket_id } = await params;
    const body = await req.json();
    const { status, notes } = body;

    const result = await findDocByTicketId(ticket_id);

    if (!result) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    const updated_at = Timestamp.now();
    const updatePayload: Record<string, unknown> = { updatedAt: updated_at };

    if (status !== undefined) updatePayload.status = status;
    if (notes !== undefined) updatePayload.notes = notes;

    await updateDoc(result.ref, updatePayload);

    return NextResponse.json({
      success: true,
      updated_at: updated_at.toDate().toISOString(),
    });
  } catch (error) {
    console.error("[PUT /api/tickets/:ticket_id]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
