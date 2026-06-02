"use client";

import { useState } from "react";
import { db } from "../../lib/firebase";
import { addDoc, collection, Timestamp } from "firebase/firestore";

export default function NewTicketPage() {
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const ticket_id = `TKT-${Date.now()}`;
      await addDoc(collection(db, "tickets"), {
        ticketId: ticket_id,
        customerName,
        customerEmail,
        subject,
        description,
        status: "Open",
        notes: [],
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });

      showToast("success", "Ticket created successfully!");
      setCustomerName("");
      setCustomerEmail("");
      setSubject("");
      setDescription("");
    } catch (error) {
      console.error(error);
      showToast("error", "Failed to create ticket. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
            Back
          </a>
        </div>
      </nav>

      <main>
        <div className="container">
          <div className="form-container">
            <div className="page-header" style={{ paddingBottom: "32px" }}>
              <h1>Create New Ticket</h1>
              <p>Fill in the details below to submit a support ticket</p>
            </div>

            <div className="card form-card animate-fade-up">
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {/* Name + Email grid */}
                <div className="form-grid">
                  <div className="input-group">
                    <label htmlFor="customer-name">Customer Name</label>
                    <div className="input-icon-wrapper">
                      <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                      <input
                        id="customer-name"
                        type="text"
                        placeholder="Jane Smith"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="input"
                        required
                      />
                    </div>
                  </div>

                  <div className="input-group">
                    <label htmlFor="customer-email">Customer Email</label>
                    <div className="input-icon-wrapper">
                      <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="20" height="16" x="2" y="4" rx="2" />
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                      </svg>
                      <input
                        id="customer-email"
                        type="email"
                        placeholder="jane@example.com"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        className="input"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Subject */}
                <div className="input-group">
                  <label htmlFor="subject">Subject</label>
                  <div className="input-icon-wrapper">
                    <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                    <input
                      id="subject"
                      type="text"
                      placeholder="Brief description of the issue"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="input"
                      required
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="input-group">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    placeholder="Provide full details about the issue, steps to reproduce, and any relevant context…"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="input"
                    required
                  />
                </div>

                <div className="divider" style={{ margin: "4px 0" }} />

                <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                  <a href="/" className="btn btn-secondary">Cancel</a>
                  <button
                    id="submit-ticket"
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                    style={{ opacity: loading ? 0.7 : 1, cursor: loading ? "not-allowed" : "pointer" }}
                  >
                    {loading ? (
                      <>
                        <span style={{
                          width: "14px", height: "14px", border: "2px solid rgba(255,255,255,0.3)",
                          borderTopColor: "white", borderRadius: "50%",
                          animation: "spin 0.6s linear infinite", display: "inline-block"
                        }} />
                        Creating…
                      </>
                    ) : (
                      <>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M12 5v14M5 12h14" />
                        </svg>
                        Create Ticket
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

      {/* Toast notification */}
      {toast && (
        <div className={`toast ${toast.type === "success" ? "toast-success" : "toast-error"}`}>
          {toast.type === "success" ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
            </svg>
          )}
          {toast.message}
        </div>
      )}
    </>
  );
}
