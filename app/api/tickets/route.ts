import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  Timestamp,
} from "firebase/firestore";

// POST /api/tickets
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customer_name, customer_email, subject, description } = body;

    if (!customer_name || !customer_email || !subject || !description) {
      return NextResponse.json(
        { error: "Missing required fields: customer_name, customer_email, subject, description" },
        { status: 400 }
      );
    }

    const ticket_id = `TKT-${Date.now()}`;
    const created_at = Timestamp.now();

    await addDoc(collection(db, "tickets"), {
      ticketId: ticket_id,
      customerName: customer_name,
      customerEmail: customer_email,
      subject,
      description,
      status: "Open",
      notes: [],
      createdAt: created_at,
      updatedAt: created_at,
    });

    return NextResponse.json(
      {
        ticket_id,
        created_at: created_at.toDate().toISOString(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/tickets]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// GET /api/tickets?status=Open&search=customer_name
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const statusFilter = searchParams.get("status");
    const searchQuery = searchParams.get("search")?.toLowerCase();

    let q = query(collection(db, "tickets"));

    if (statusFilter && statusFilter !== "All") {
      q = query(collection(db, "tickets"), where("status", "==", statusFilter));
    }

    const snapshot = await getDocs(q);

    let tickets = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        ticket_id: data.ticketId,
        customer_name: data.customerName,
        customer_email: data.customerEmail,
        subject: data.subject,
        description: data.description,
        status: data.status,
        created_at:
          data.createdAt instanceof Timestamp
            ? data.createdAt.toDate().toISOString()
            : data.createdAt,
      };
    });

    if (searchQuery) {
      tickets = tickets.filter((t) =>
        t.customer_name?.toLowerCase().includes(searchQuery) ||
        t.customer_email?.toLowerCase().includes(searchQuery) ||
        t.ticket_id?.toLowerCase().includes(searchQuery) ||
        t.subject?.toLowerCase().includes(searchQuery) ||
        t.description?.toLowerCase().includes(searchQuery)
      );
    }

    return NextResponse.json(tickets, { status: 200 });
  } catch (error) {
    console.error("[GET /api/tickets]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
