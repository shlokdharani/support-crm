"use client";

import { useEffect, useState } from "react";
import { db } from "../../../lib/firebase";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";

export default function TicketDetailPage({ params }: any) {
  const [ticket, setTicket] = useState<any>(null);
  const [note, setNote] = useState("");
  const [addingNote, setAddingNote] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const id = params.id;

  useEffect(() => {
    fetchTicket();
  }, []);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchTicket = async () => {
    try {
      const docRef = doc(db, "tickets", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setTicket({ id: docSnap.id, ...docSnap.data() });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const updateStatus = async (status: string) => {
    setUpdatingStatus(true);
    try {
      await updateDoc(doc(db, "tickets", id), { status });
      await fetchTicket();
      showToast("success", `Status updated to "${status}"`);
    } catch (error) {
      console.error(error);
      showToast("error", "Failed to update status.");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const addNote = async () => {
    if (!note.trim()) return;
    setAddingNote(true);
    try {
      await updateDoc(doc(db, "tickets", id), {
        notes: arrayUnion({
          text: note.trim(),
          createdAt: new Date().toISOString(),
          author: "Support Agent"
        }),
      });
      setNote("");
      await fetchTicket();
      showToast("success", "Note added successfully.");
    } catch (error) {
      console.error(error);
      showToast("error", "Failed to add note.");
    } finally {
      setAddingNote(false);
    }
  };

  const handleNoteKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      addNote();
    }
  };

  const formatNoteDate = (createdAtStr: string) => {
    if (!createdAtStr) return "—";
    try {
      const date = new Date(createdAtStr);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });
    } catch {
      return "—";
    }
  };

  const getBadgeClass = (status: string) => {
    if (status === "Open") return "badge badge-open";
    if (status === "In Progress") return "badge badge-progress";
    return "badge badge-closed";
  };

  const formatDate = (ts: any) => {
    if (!ts) return "—";
    const date = ts.toDate ? ts.toDate() : new Date(ts);
    return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  };

  if (!ticket) {
    return (
      <>
        <nav className="navbar">
          <div className="container navbar-inner">
            <a href="/" className="logo">
              <div className="logo-mark">S</div>
              <span className="logo-text">SupportCRM</span>
            </a>
          </div>
        </nav>
        <div style={{ display: "flex", justifyContent: "center", paddingTop: "80px" }}>
          <div className="spinner" style={{ margin: "0" }} />
        </div>
      </>
    );
  }

  return (
    <>
      {/* Navbar */}
      <nav className="navbar">
        <div className="container navbar-inner">
          <a href="/" className="logo">
            <div className="logo-mark">S</div>
            <span className="logo-text">SupportCRM</span>
          </a>
          <a href="/" className="btn btn-ghost">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Dashboard
          </a>
        </div>
      </nav>

      <main>
        <div className="container" style={{ paddingTop: "40px", paddingBottom: "80px" }}>
          {/* Ticket Header */}
          <div style={{ marginBottom: "28px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" }}>
              <div>
                <div style={{ marginBottom: "8px" }}>
                  <span className="ticket-id-tag">{ticket.ticketId}</span>
                </div>
                <h1 style={{ fontSize: "28px", fontWeight: 800, color: "var(--text-primary)", fontFamily: "'Syne', sans-serif", letterSpacing: "-0.02em", marginBottom: "4px" }}>
                  {ticket.subject}
                </h1>
                <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
                  Opened {formatDate(ticket.createdAt)}
                </p>
              </div>
              <span className={getBadgeClass(ticket.status)} style={{ fontSize: "13px", padding: "6px 16px" }}>
                {ticket.status}
              </span>
            </div>
          </div>

          {/* Two-column layout */}
          <div className="detail-grid animate-fade-up">
            {/* Left: Main content */}
            <div>
              {/* Customer Info */}
              <div className="card detail-section" style={{ marginBottom: "16px" }}>
                <h2>Customer</h2>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                  <div className="detail-field">
                    <div className="detail-label">Name</div>
                    <div className="detail-value">{ticket.customerName}</div>
                  </div>
                  <div className="detail-field">
                    <div className="detail-label">Email</div>
                    <div className="detail-value" style={{ wordBreak: "break-all" }}>
                      <a href={`mailto:${ticket.customerEmail}`} style={{ color: "var(--accent)", textDecoration: "none" }}>
                        {ticket.customerEmail}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="card detail-section" style={{ marginBottom: "16px" }}>
                <h2>Description</h2>
                <p className="description-text">{ticket.description}</p>
              </div>

              {/* Notes */}
              <div className="card detail-section">
                <h2>Notes & Comments</h2>

                {/* Add note input */}
                <div style={{ display: "flex", gap: "12px", marginBottom: "24px", alignItems: "flex-end" }}>
                  <div style={{ flex: 1 }}>
                    <textarea
                      id="note-input"
                      placeholder="Type a note or comment… (Ctrl + Enter to submit)"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      onKeyDown={handleNoteKeyDown}
                      className="input"
                      rows={3}
                      style={{ minHeight: "80px", resize: "vertical", display: "block" }}
                    />
                  </div>
                  <button
                    id="add-note-btn"
                    onClick={addNote}
                    className="btn btn-primary"
                    disabled={addingNote || !note.trim()}
                    style={{
                      height: "44px",
                      whiteSpace: "nowrap",
                      opacity: (!note.trim() || addingNote) ? 0.5 : 1,
                      cursor: (!note.trim() || addingNote) ? "not-allowed" : "pointer"
                    }}
                  >
                    {addingNote ? "Adding…" : "Add Note"}
                  </button>
                </div>

                {/* Notes list */}
                {!ticket.notes || ticket.notes.length === 0 ? (
                  <div style={{ color: "var(--text-muted)", fontSize: "14px", padding: "32px 0", textAlign: "center" }}>
                    No notes yet. Add the first one above.
                  </div>
                ) : (
                  <div className="timeline-wrapper">
                    <div className="timeline">
                      {ticket.notes.map((n: any, i: number) => {
                        const author = n.author || "Support Agent";
                        const initials = author.split(" ").map((w: string) => w[0]).join("").toUpperCase().substring(0, 2) || "SA";
                        return (
                          <div key={i} className="timeline-item">
                            <div className="timeline-dot" />
                            <div className="timeline-avatar">
                              {initials}
                            </div>
                            <div className="timeline-content-wrapper">
                              <div className="timeline-header">
                                <span className="timeline-author">{author}</span>
                                {n.createdAt && (
                                  <span className="timeline-time">
                                    {formatNoteDate(n.createdAt)}
                                  </span>
                                )}
                              </div>
                              <p className="timeline-text">{n.text}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Sidebar */}
            <div>
              {/* Update Status */}
              <div className="card detail-section" style={{ marginBottom: "16px" }}>
                <h2>Update Status</h2>
                <div className="status-buttons">
                  <button
                    id="status-open"
                    onClick={() => updateStatus("Open")}
                    disabled={updatingStatus}
                    className={`status-btn status-btn-open ${ticket.status === "Open" ? "active" : ""}`}
                  >
                    Open
                  </button>
                  <button
                    id="status-in-progress"
                    onClick={() => updateStatus("In Progress")}
                    disabled={updatingStatus}
                    className={`status-btn status-btn-progress ${ticket.status === "In Progress" ? "active" : ""}`}
                  >
                    In Progress
                  </button>
                  <button
                    id="status-closed"
                    onClick={() => updateStatus("Closed")}
                    disabled={updatingStatus}
                    className={`status-btn status-btn-closed ${ticket.status === "Closed" ? "active" : ""}`}
                  >
                    Closed
                  </button>
                </div>
              </div>

              {/* Ticket Meta */}
              <div className="card detail-section">
                <h2>Details</h2>
                <div className="detail-field">
                  <div className="detail-label">Ticket ID</div>
                  <div className="detail-value" style={{ fontFamily: "monospace", fontSize: "13px" }}>
                    {ticket.ticketId}
                  </div>
                </div>
                <div className="detail-field">
                  <div className="detail-label">Status</div>
                  <div><span className={getBadgeClass(ticket.status)}>{ticket.status}</span></div>
                </div>
                <div className="detail-field">
                  <div className="detail-label">Created</div>
                  <div className="detail-value">{formatDate(ticket.createdAt)}</div>
                </div>
                <div className="detail-field" style={{ marginBottom: 0 }}>
                  <div className="detail-label">Notes</div>
                  <div className="detail-value">{ticket.notes?.length ?? 0}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Toast */}
      {toast && (
        <div className={`toast ${toast.type === "success" ? "toast-success" : "toast-error"}`}>
          {toast.type === "success" ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6 9 17l-5-5" /></svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" /></svg>
          )}
          {toast.message}
        </div>
      )}
    </>
  );
}
