# Support CRM — Professional Support Ticket Management

Support CRM is a modern, high-performance web application designed for managing and resolving customer support tickets efficiently. Built with **Next.js 15**, **React 19**, **TypeScript**, and **Firebase Firestore**, it features a beautiful, dark-mode glassmorphic user interface designed to maximize speed, responsiveness, and productivity.

---

## 🌟 Key Product Features

### 1. Create Support Tickets
* **Seamless Ingestion**: Capture critical customer information (full name, contact email, brief subject/title, and detailed description).
* **Auto-Ingestion Engine**: Automatically provisions a unique ticket ID (format: `TKT-[timestamp]`) and logs the high-precision creation timestamp.

### 2. Interactive Support Dashboard
* **Clean List View**: Summarizes active cases showing Ticket ID tags, Customer Name, Issue Subject, current Status Badge, and relative Opened Date.
* **Responsive Analytics**: Micro-dashboard presenting high-level status metrics: Total Tickets, Open count, In Progress count, and Closed count.

### 3. Universal Search engine
* **Quick Query Filter**: Search dynamically as you type across multiple parameters:
  * Customer names
  * Contact emails
  * Issue subjects
  * Detailed descriptions
  * Ticket IDs

### 4. Categorical Status Filtering
* **Instant Segmenting**: Filter the ticket stream in real-time by status types:
  * `Open` (Red-themed subtle glow)
  * `In Progress` (Amber-themed subtle glow)
  * `Closed` (Emerald-themed subtle glow)

### 5. View & Update Timeline Thread
* **Comprehensive Detail Screen**: Deep dive into customer details, full problem descriptions, and systemic properties.
* **Status Governor**: Update status instantly using tailored interactive buttons.
* **Premium Note Timeline**: Log internal updates and developer comments into a beautiful visual feed connected by a line timeline. Includes automatic author attribution, initials-based custom avatars (e.g. "SA" for "Support Agent"), and timestamp tracking.

---

## 🛠️ Technology Stack

* **Frontend Framework**: Next.js 15.3.2 (App Router)
* **Runtime & Type System**: React 19 & TypeScript 5
* **Styling & Theme**: Modern HSL-curated Vanilla CSS (Dark Theme, Glassmorphism, Syne & DM Sans typography, custom micro-animations).
* **Database & Storage**: Google Cloud Firebase Firestore

---

## 🚀 Quick Start & Installation

To run this application locally on your system, follow these steps:

### 1. Clone the Repository and Install Dependencies
Ensure you have Node.js installed, then execute:
```bash
npm install
```

### 2. Configure Environment Variables
Copy the template configuration file into your active local environment:
```bash
cp .env.example .env.local
```
Open `.env.local` and substitute the variables with your actual Firebase project settings:
```ini
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=support-crm-xxxxx.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=support-crm-xxxxx
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=support-crm-xxxxx.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=831709531590
NEXT_PUBLIC_FIREBASE_APP_ID=1:831709531590:web:xxxxxxxxxxxxxxxxxxxx
```

### 3. Launch Development Server
Startup the Next.js Turbo-powered development server:
```bash
npm run dev
```
Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛢️ Firebase Firestore Database Schema

The system uses a flat Firestore collection named `tickets`. Each document represents a support issue structured as follows:

```json
{
  "ticketId": "TKT-1717281045934",     // String (auto-generated)
  "customerName": "Jane Doe",          // String
  "customerEmail": "jane@example.com", // String
  "subject": "Unable to access portal",// String
  "description": "Getting error 502...",// String
  "status": "In Progress",             // String ('Open' | 'In Progress' | 'Closed')
  "createdAt": "Timestamp",            // Firestore Timestamp object
  "updatedAt": "Timestamp",            // Firestore Timestamp object
  "notes": [                           // Array of Note objects
    {
      "text": "Sent password reset mail.",
      "createdAt": "2026-06-02T07:49:11.234Z",
      "author": "Support Agent"
    }
  ]
}
```

---

## 📡 REST API Documentation

Support CRM exposes native REST API endpoints, allowing programmatic ticket management, integrations, and third-party automated workflows.

### 1. List / Search Tickets
* **Endpoint**: `GET /api/tickets`
* **Query Parameters**:
  * `status` (Optional): Filter tickets by status (e.g. `Open`, `In Progress`, `Closed`). Defaults to `All`.
  * `search` (Optional): Query term to filter by. Automatically searches customer names, emails, ticket IDs, subjects, and descriptions.
* **Response Example** (`200 OK`):
```json
[
  {
    "ticket_id": "TKT-1717281045934",
    "customer_name": "Jane Doe",
    "customer_email": "jane@example.com",
    "subject": "Unable to access portal",
    "description": "Getting error 502...",
    "status": "In Progress",
    "created_at": "2026-06-02T07:48:47.000Z"
  }
]
```

### 2. Create Ticket
* **Endpoint**: `POST /api/tickets`
* **Payload Headers**: `Content-Type: application/json`
* **Body Parameters**:
  * `customer_name` (Required): Full name of the user.
  * `customer_email` (Required): Contact email address.
  * `subject` (Required): Brief summary of the problem.
  * `description` (Required): Full description of the issue.
* **Response Example** (`210 Created`):
```json
{
  "ticket_id": "TKT-1717281050012",
  "created_at": "2026-06-02T07:51:24.000Z"
}
```

### 3. Fetch Ticket Details
* **Endpoint**: `GET /api/tickets/[ticket_id]`
* **Path Parameters**:
  * `ticket_id` (Required): The user-facing ticket ID (e.g., `TKT-1717281050012`).
* **Response Example** (`200 OK`):
```json
{
  "ticket_id": "TKT-1717281050012",
  "customer_name": "Jane Doe",
  "customer_email": "jane@example.com",
  "subject": "Unable to access portal",
  "description": "Getting error 502...",
  "status": "Open",
  "notes": [
    {
      "text": "Note content...",
      "createdAt": "2026-06-02T07:52:00.123Z",
      "author": "Support Agent"
    }
  ]
}
```

### 4. Update Ticket (Status and Comments)
* **Endpoint**: `PUT /api/tickets/[ticket_id]`
* **Path Parameters**:
  * `ticket_id` (Required): User-facing ticket ID (e.g., `TKT-1717281050012`).
* **Body Parameters** (Provide either or both):
  * `status` (Optional): Update the ticket status (`Open` | `In Progress` | `Closed`).
  * `notes` (Optional): An updated array of note objects.
* **Response Example** (`200 OK`):
```json
{
  "success": true,
  "updated_at": "2026-06-02T07:53:15.000Z"
}
```
