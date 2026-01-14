## Support Ticket Management System ##

A high-performance, full-stack Support Ticket System designed for modern technical assistance workflows. This application features a sleek dark-mode interface, role-based dashboards, and real-time internal communication.
 About the Project

This platform is built to streamline the interaction between Clients and Support Agents.

    Clients can easily report issues, track the progress of their requests, and chat directly with assigned agents.

    Agents have access to a command center to manage the ticket lifecycle—from opening a case to resolving it—backed by data-driven statistics and history tracking.

 ## Tech Stack ##

Built with the T3-inspired stack for maximum type safety and developer productivity:

    Framework: Next.js 15 (App Router & React Server Components)

    Language: TypeScript (Strictly typed frontend & backend)

    Database: PostgreSQL

    ORM: Prisma

    Styling: Tailwind CSS

    Authentication: JWT-based Secure Authentication

    State Management: React Context API

 Project Structure

The codebase is organized following modern Next.js conventions:

├── app/
│   ├── api/              # API Route Handlers (GET, POST, PUT, DELETE)
│   │   ├── tickets/      # Ticket management endpoints
│   │   └── comments/     # Chat and messaging endpoints
│   ├── dashboard/        # Role-based entry points
│   │   ├── agent/        # Agent dashboard (Stats, Filters, History)
│   │   └── client/       # Client dashboard (My Tickets, Status)
│   └── tickets/[id]/     # Real-time chat & ticket detail view
├── components/           # Reusable UI (Header, Badges, Protected Routes)
├── context/              # Global Auth & User State
├── lib/                  # Prisma Client & Auth utilities
├── types/                # Centralized TypeScript interfaces (Ticket, User, Comment)
└── prisma/               # Database Schema (Models & Migrations)


 ## Getting Started ##
Prerequisites

    Node.js (v18.0 or higher)

    A running PostgreSQL database

Installation

  1. Clone the repository:


git clone https://github.com/your-username/support-ticket-system.git
cd support-ticket-system

 2. Install dependencies:
    npm install

3. Setup Environment Variables: Create a .env file in the root directory:

DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
JWT_SECRET="your_secure_random_string"


4. Database Synchronization & Seeding:
   Execute these commands to prepare your local database:

   npx prisma generate
   npx prisma db push
   npx prisma db seed


5  . Run the application:

npm run dev

## Test Credentials ## 
Once the seed command is executed, use these accounts to test the system:

      RoleEmailPasswordSupport 
      Agent : agent@example.com  123456  
      Client User : client@example.com  123456

## Key Features & Usage ##

-- For Support Agents -- 
    Quick Stats: Track open, in-progress, and resolved tickets at a glance.

    Ticket Lifecycle: Move tickets through statuses (Attend ⮕ Resolve).

    Internal Chat: Communicate with clients through a fixed-position chat interface.

    Record Management: Permanently delete tickets or review the management history.

 For Clients

    Ticket Creation: Simple forms to submit technical issues.

    Live Tracking: See exactly when an agent starts working on your case.

    Direct Feedback: Reply to agent messages within the ticket detail view.

    Security & Scalability

    Type-Safe API: Every endpoint is strictly typed using TypeScript interfaces to prevent data corruption.

    RBAC (Role-Based Access Control): Secure wrappers ensure clients cannot access agent-only administrative functions.

    Clean UI: Mobile-responsive design using Tailwind CSS for a consistent experience across all devices.

# Author # 
    : Andres Armenta Lopez
