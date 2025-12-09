HelpDeskPro - Support Ticket System

https://img.shields.io/badge/Next.js-14-black?logo=next.js
https://img.shields.io/badge/TypeScript-5.2-blue?logo=typescript
https://img.shields.io/badge/Tailwind_CSS-3.3-38B2AC?logo=tailwind-css

A modern, full-featured support ticket management system built with Next.js, TypeScript, and Tailwind CSS. This application simulates a professional help desk environment with role-based access, ticket management, and real-time communication.
Live Demo

Note: This is a demo application running with in-memory data storage.
Features
Authentication & Authorization

    Role-based access control (Client & Agent)

    Secure login/logout with session persistence

    Protected routes based on user roles

    Automatic redirection to appropriate dashboards

Ticket Management

    Create tickets with title, description, and priority levels

    Track ticket status (Open → In Progress → Resolved → Closed)

    Priority system (Low, Medium, High) with visual indicators

    Filter tickets by status and priority

    Real-time updates on ticket changes

Communication System

    Comment threads for each ticket

    Role-based commenting (Clients can provide details, Agents can respond)

    Chronological display of all conversations

    No comments allowed on closed tickets

User Roles
Client (Customer)

    Create new support tickets

    View only their own tickets

    Add comments to their tickets

    Track ticket progress

Agent (Support Staff)

    View all tickets in the system

    Filter tickets by status and priority

    Change ticket status

    Assign tickets to themselves

    Respond to client inquiries

    Close resolved tickets

UI Components

    Reusable Button component with variants (primary, secondary, danger)

    Badge component for status and priority indicators

    Card component for consistent content containers

    Responsive design for mobile and desktop

    Modern, clean interface with Tailwind CSS

Technology Stack

    Frontend Framework: Next.js 14 (App Router)

    Language: TypeScript

    Styling: Tailwind CSS

    State Management: React Context API

    Build Tool: Vite (via Next.js)

    Package Manager: npm/yarn

Project Structure
text

helpdesk-pro/
├── types/ # TypeScript type definitions
├── lib/ # Data layer and business logic
├── context/ # React Context providers
├── components/ # Reusable UI components
│ ├── ui/ # Basic UI components (Button, Badge, Card)
│ └── layout/ # Layout components (Header, ProtectedRoute)
├── pages/ # Next.js pages and API routes
│ ├── api/ # API endpoints
│ │ ├── auth/ # Authentication API
│ │ ├── tickets/ # Tickets CRUD API
│ │ └── comments/ # Comments API
│ ├── dashboard/ # User dashboards
│ ├── tickets/ # Ticket pages
│ └── \_app.tsx # App wrapper
├── styles/ # Global styles
└── public/ # Static assets

🚦 Quick Start
Prerequisites

    Node.js 18+

    npm or yarn

Installation

    Clone the repository
    bash

git clone <repository-url>
cd helpdesk-pro

Install dependencies
bash

npm install

Run the development server
bash

npm run dev

    Open your browser
    Navigate to http://localhost:3000

Test Credentials

Use these credentials to test the application:
Client Account

    Email: cliente@example.com

    Password: cliente123

👨 Agent Account

    Email: agente@example.com

    Password: agente123

User Guide
For Clients

    Login with client credentials

    View your tickets on the dashboard

    Create new tickets by clicking "New Ticket"

    Add comments to existing tickets

    Track progress through status badges

For Agents

    Login with agent credentials

    View all tickets on the dashboard

    Use filters to find specific tickets

    Change ticket status as you work on them

    Respond to clients via comments

    Close tickets when issues are resolved

Testing Features

1. Authentication Flow

   Try logging in with wrong credentials

   Test automatic redirection based on roles

   Verify protected routes can't be accessed without login

2. Ticket Management

   Create tickets with different priorities

   Change ticket status through the workflow

   Test validation (required fields, etc.)

3. Communication

   Add comments as both client and agent

   Verify comments display chronologically

   Test that closed tickets don't accept new comments

4. UI/UX

   Test responsive design on different screen sizes

   Verify all button states (hover, active, disabled)

   Check badge colors match status/priority

API Endpoints
Authentication

    POST /api/auth/login - User authentication

Tickets

    GET /api/tickets - List all tickets (filterable by user)

    POST /api/tickets - Create a new ticket

    GET /api/tickets/[id] - Get specific ticket details

    PUT /api/tickets/[id] - Update ticket (status, priority, etc.)

Comments

    GET /api/comments - List comments (filterable by ticketId)

    POST /api/comments - Add a new comment

Design System
Colors

    Primary: Blue (#3B82F6)

    Success: Green (#10B981)

    Warning: Yellow (#F59E0B)

    Danger: Red (#EF4444)

    Info: Blue (#3B82F6)

Status Indicators

    Open: Blue badge

    In Progress: Yellow badge

    Resolved: Green badge

    Closed: Red badge

Priority Indicators

    Low: Blue badge

    Medium: Yellow badge

    High: Red badge

📱 Responsive Design

The application is fully responsive:

    Mobile: Single column layout, touch-friendly buttons

    Tablet: Adjusted spacing, larger touch targets

    Desktop: Multi-column layouts, hover effects

Security Features

    Role-based access control for all operations

    Protected API endpoints with user validation

    No sensitive data exposure in responses

    Session persistence via localStorage

Data Model
typescript

interface User {
id: string;
name: string;
email: string;
role: 'client' | 'agent';
}

interface Ticket {
id: string;
title: string;
description: string;
createdBy: string;
assignedTo?: string;
status: 'open' | 'in_progress' | 'resolved' | 'closed';
priority: 'low' | 'medium' | 'high';
createdAt: string;
updatedAt: string;
}

interface Comment {
id: string;
ticketId: string;
author: string;
message: string;
createdAt: string;
}

Notes
Data Persistence

Important: This application uses in-memory data storage. All data will be lost when:

    The server restarts

    The browser is refreshed (for some data)

    The application is rebuilt

Future Enhancements

    Database Integration (MongoDB, PostgreSQL)

    Real-time updates with WebSockets

    Email notifications for ticket updates

    File attachments in tickets and comments

    Advanced search with filters

    User profiles with avatars

    Reporting dashboard with analytics

    Mobile application with React Native

Troubleshooting
Common Issues

    "Module not found" errors

        Run npm install to ensure all dependencies are installed

        Check that all files are in the correct locations

    TypeScript errors

        Run npx tsc --noEmit to check for type errors

        Ensure all imports are correct

    Styles not loading

        Verify Tailwind CSS is properly configured

        Check that globals.css is imported in _app.tsx

    API routes not working

        Check the server console for errors

        Verify API endpoint paths are correct

Development Commands
bash

# Start development server

npm run dev

# Build for production

npm run build

# Start production server

npm start

# Lint code

npm run lint

# Check TypeScript types

npx tsc --noEmit

Contributing

While this is a demo project, contributions are welcome! Please:

    Fork the repository

    Create a feature branch

    Make your changes

    Submit a pull request

License

This project is open source and available for educational purposes.
Developer

Name: [Your Name]
Clan: [Your Clan]
Email: [Your Email]
ID: [Your ID]

Ready to manage support tickets like a pro!
