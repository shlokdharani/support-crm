"use client";

import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function HomePage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "tickets"));
      const ticketData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTickets(ticketData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.customerName?.toLowerCase().includes(search.toLowerCase()) ||
      ticket.customerEmail?.toLowerCase().includes(search.toLowerCase()) ||
      ticket.subject?.toLowerCase().includes(search.toLowerCase()) ||
      ticket.description?.toLowerCase().includes(search.toLowerCase()) ||
      ticket.ticketId?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || ticket.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const openCount = tickets.filter((t) => t.status === "Open").length;
  const progressCount = tickets.filter((t) => t.status === "In Progress").length;
  const closedCount = tickets.filter((t) => t.status === "Closed").length;

  const formatDate = (ts: any) => {
    if (!ts) return "—";
    const date = ts.toDate ? ts.toDate() : new Date(ts);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getBadgeClass = (status: string) => {
    if (status === "Open") return "badge badge-open";
    if (status === "In Progress") return "badge badge-progress";
    return "badge badge-closed";
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
          <a href="/new" className="btn btn-primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
            New Ticket
          </a>
        </div>
      </nav>

      <main>
        <div className="container">
          {/* Page Header */}
          <div className="page-header">
            <h1>Support Dashboard</h1>
            <p>Manage and resolve customer issues with ease</p>
          </div>

          {/* Stats */}
          <div className="stats-row">
            <div className="card stat-card">
              <span className="stat-number">{tickets.length}</span>
              <span className="stat-label">Total Tickets</span>
            </div>
            <div className="card stat-card">
              <span className="stat-number" style={{ color: "var(--red)" }}>{openCount}</span>
              <span className="stat-label">Open</span>
            </div>
            <div className="card stat-card">
              <span className="stat-number" style={{ color: "var(--yellow)" }}>{progressCount}</span>
              <span className="stat-label">In Progress</span>
            </div>
          </div>

          {/* Ticket List Card */}
          <div className="card animate-fade-up">
            {/* Filter Bar */}
            <div className="filter-bar">
              <div className="input-icon-wrapper" style={{ flex: 1, minWidth: "220px" }}>
                <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                </svg>
                <input
                  id="search-input"
                  type="text"
                  placeholder="Search tickets, customers…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="input"
                />
              </div>
              <select
                id="status-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input"
                style={{ width: "auto", minWidth: "140px" }}
              >
                <option value="All">All Statuses</option>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            {/* Ticket Rows */}
            {loading ? (
              <div className="spinner" />
            ) : filteredTickets.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
                    <rect x="9" y="3" width="6" height="4" rx="1" />
                  </svg>
                </div>
                <h3>No tickets found</h3>
                <p>
                  {search || statusFilter !== "All"
                    ? "Try adjusting your filters."
                    : "Create your first ticket to get started."}
                </p>
              </div>
            ) : (
              <div className="ticket-list">
                {filteredTickets.map((ticket) => (
                  <a
                    key={ticket.id}
                    href={`/ticket/${ticket.id}`}
                    className="ticket-row"
                  >
                    <span className="ticket-id-tag">{ticket.ticketId}</span>
                    <div>
                      <div className="ticket-subject">{ticket.subject}</div>
                      <div className="ticket-meta">{ticket.customerName}</div>
                    </div>
                    <span className={getBadgeClass(ticket.status)}>
                      {ticket.status}
                    </span>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span className="ticket-date">{formatDate(ticket.createdAt)}</span>
                      <svg className="arrow-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
