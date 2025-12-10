# HelpDeskPro - Technical Support Management System

A modern Next.js application for managing technical support tickets with role-based access (client and agent), built with Prisma ORM and PostgreSQL.

##  Features

-  User authentication with JWT and secure HTTP-only cookies
-  Complete ticket management (CRUD operations)
-  Real-time comment system on tickets
-  Role-based dashboards (Client/Agent)
-  Ticket status tracking (Open, In Progress, Resolved, Closed)
-  Priority levels (Low, Medium, High)
-  Protected routes by authentication
-  Responsive UI with Tailwind CSS v4
-  Smooth animations with Framer Motion
-  Type-safe development with TypeScript

##  Requirements

- **Node.js**: 18 or higher
- **PostgreSQL**: 12 or higher
- **npm** or **yarn**

---

##  Quick Start (5 Minutes)

### Step 1: Create PostgreSQL Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Inside psql:
CREATE DATABASE helpdeskpro;
\q
```

### Step 2: Configure Environment Variables

Edit `.env.local` and replace with your database credentials:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/helpdeskpro"
JWT_SECRET="your-super-secure-secret-2024"
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

### Step 3: Install and Setup

```bash
# Navigate to project
cd nextjs-Prueba-Desempe-o

# Install dependencies
npm install

# Create database schema
npx prisma migrate dev --name init

# Load test data (optional)
npm run seed

# Start development server
npm run dev
```

### Step 4: Access the Application

Open your browser: **http://localhost:3000**

**Test Credentials:**
- Email: `client@example.com`
- Password: `123456`

---

##  Detailed Setup Guide

### Installation Steps

#### 1. Install PostgreSQL

**Windows:**
- Download from: https://www.postgresql.org/download/windows/
- Run installer with default settings
- Remember the `postgres` user password

**macOS:**
```bash
brew install postgresql@15
brew services start postgresql@15
```

**Linux (Ubuntu):**
```bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

#### 2. Create Database

```powershell
# Windows PowerShell
psql -U postgres

# Inside psql terminal
CREATE DATABASE helpdeskpro;
\l  # List databases to verify
\q  # Exit
```

#### 3. Clone & Setup Project

```bash
# Clone repository
git clone <repository-url>
cd nextjs-Prueba-Desempe-o

# Install Node dependencies
npm install
```

#### 4. Configure Environment

Create `.env.local` with your database credentials:

```env
# Database Connection
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/helpdeskpro"

# JWT Configuration
JWT_SECRET="your-super-secure-secret-key-minimum-32-characters"

# Public API URL
NEXT_PUBLIC_API_URL="http://localhost:3000"

# Email Settings (Optional - for future email notifications)
SMTP_HOST="smtp.example.com"
SMTP_PORT="587"
SMTP_USER="your-email@example.com"
SMTP_PASS="your-password"
SYSTEM_EMAIL="noreply@helpdeskpro.com"
```

#### 5. Initialize Database Schema

```bash
# Create all tables using Prisma migrations
npx prisma migrate dev --name init

# This will:
# 1. Create migration files
# 2. Run migrations on PostgreSQL
# 3. Generate Prisma Client
```

#### 6. Seed Database with Test Data (Optional)

```bash
# Load test users and tickets
npm run seed

# This creates:
# - Client user: client@example.com / 123456
# - Agent user: agent@example.com / 123456
# - 2 sample tickets
# - 2 sample comments
```

#### 7. Start Development Server

```bash
npm run dev

# You should see:
# > ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

---

##  Available Scripts


# Development
npm run dev                    # Start dev server with hot reload
npm run build                  # Build for production
npm run start                  # Start production server

# Database Management
npm run prisma:migrate         # Run pending migrations
npm run prisma:generate        # Regenerate Prisma Client
npm run prisma:seed            # Run seed script
npm run seed                   # Alias for prisma:seed
npx prisma studio             # Open Prisma Studio (database GUI)
npx prisma db push            # Push schema without migrations
npx prisma migrate reset       # Reset database (deletes all data)
```

---

##  Project Structure

```
app/
├── api/                           # API Routes
│   ├── auth/
│   │   ├── login/route.ts        # User login endpoint
│   │   └── register/route.ts     # User registration endpoint
│   ├── tickets/
│   │   ├── route.ts              # List and create tickets
│   │   └── [id]/route.ts         # Get and update ticket
│   └── comments/
│       ├── index.ts              # List and create comments
│       └── [ticketId]/route.ts   # Get and create ticket comments
├── dashboard/
│   ├── client/page.tsx           # Client dashboard
│   └── agent/page.tsx            # Agent dashboard
├── tickets/
│   ├── [id]/page.tsx             # Ticket detail page
│   └── new/page.tsx              # Create new ticket page
├── register/page.tsx             # Registration page
├── page.tsx                       # Login page
├── layout.tsx                     # Root layout
├── globals.css                    # Global styles
└── middleware.ts                  # API route protection

components/
├── Badge.tsx                      # Status/Priority badge
├── Button.tsx                     # Reusable button
├── Card.tsx                       # Card container
└── layout/
    ├── Header.tsx                 # Navigation header
    └── ProtectedRoute.tsx         # Route protection wrapper

context/
└── AuthContext.tsx                # Authentication context

lib/
├── auth.ts                        # JWT utilities
├── prisma.ts                      # Prisma client singleton
├── services.ts                    # API service calls
└── services/
    └── authService.ts             # Authentication service

prisma/
├── schema.prisma                  # Database schema
├── seed.ts                        # Test data script
└── migrations/                    # Migration history

types/
└── index.ts                       # TypeScript types

public/                            # Static files
```

---

##  Database Schema

### User Model
```typescript
{
  id: string (UUID)              // Unique identifier
  name: string                   // User's full name
  email: string (unique)         // Email address
  password: string (hashed)      // Bcrypt encrypted password
  role: 'client' | 'agent'       // User role
  tickets: Ticket[]              // Created tickets
  comments: Comment[]            // Written comments
  createdAt: DateTime            // Account creation date
}
```

### Ticket Model
```typescript
{
  id: string (UUID)                           // Unique identifier
  title: string                               // Ticket title
  description: string                         // Detailed description
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  priority: 'low' | 'medium' | 'high'        // Priority level
  createdAt: DateTime                         // Creation timestamp
  updatedAt: DateTime                         // Last update timestamp
  userId: string (FK)                         // Creator's ID
  user: User                                  // Creator reference
  comments: Comment[]                         // Associated comments
}
```

### Comment Model
```typescript
{
  id: string (UUID)              // Unique identifier
  content: string                // Comment text
  createdAt: DateTime            // Creation timestamp
  userId: string (FK)            // Author's ID
  ticketId: string (FK)          // Ticket's ID
  user: User                      // Author reference
  ticket: Ticket                  // Ticket reference
}
```

---

##  Authentication

### How It Works

1. **Registration/Login**: User credentials validated against bcrypt-hashed passwords in database
2. **JWT Token**: Upon successful authentication, a JWT token is generated with:
   - User ID
   - User Role (client/agent)
   - Expiration: 2 hours
3. **Secure Storage**: Token stored in HTTP-only cookie (can't be accessed by JavaScript)
4. **API Protection**: All protected endpoints verify JWT token from cookies
5. **Automatic Refresh**: Token automatically sent with each API request via middleware

### Protected Endpoints

- `GET /api/tickets` - Requires authentication
- `POST /api/tickets` - Requires authentication
- `GET /api/tickets/[id]` - Requires authentication
- `PUT /api/tickets/[id]` - Requires agent role
- `GET /api/comments` - Requires authentication
- `POST /api/comments` - Requires authentication

---

##  API Endpoints

### Authentication

```bash
# Register new user
POST /api/auth/register
Content-Type: application/json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secure_password",
  "role": "client"  # or "agent"
}

# Login
POST /api/auth/login
Content-Type: application/json
{
  "email": "john@example.com",
  "password": "secure_password"
}

Response:
{
  "success": true,
  "data": {
    "user": { id, name, email, role },
    "token": "jwt_token_here"
  }
}
```

### Tickets

```bash
# Get all tickets (agents see all, clients see own)
GET /api/tickets

# Get specific ticket
GET /api/tickets/[id]

# Create new ticket
POST /api/tickets
{
  "title": "Problem with login",
  "description": "Cannot access account",
  "priority": "high"
}

# Update ticket (agents only)
PUT /api/tickets/[id]
{
  "status": "in_progress",
  "priority": "medium"
}
```

### Comments

```bash
# Get ticket comments
GET /api/comments/[ticketId]

# Add comment to ticket
POST /api/comments/[ticketId]
{
  "message": "We're investigating the issue"
}

# Get all comments by ticket
GET /api/comments?ticketId=[id]
```

---

##  Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Frontend** | Next.js | 13.5.9 |
| | React | 18.2.0 |
| | TypeScript | 5.9.3 |
| | Tailwind CSS | 4.1.17 |
| | Framer Motion | 12.23.26 |
| **Backend** | Next.js API Routes | 13.5.9 |
| **Database** | PostgreSQL | 12+ |
| | Prisma ORM | 7.1.0 |
| **Security** | JWT | jsonwebtoken 9.0.3 |
| | Bcrypt | bcryptjs 3.0.3 |
| **HTTP Client** | Axios | 1.13.2 |

---

##  Troubleshooting

### Database Connection Issues

**Error: "connect ECONNREFUSED 127.0.0.1:5432"**


# Check PostgreSQL is running
# Windows (PowerShell)
Get-Service postgresql*

# macOS
brew services list

# Linux
sudo systemctl status postgresql

# Start PostgreSQL if stopped
# Windows: net start postgresql-x64-15
# macOS: brew services start postgresql@15
# Linux: sudo systemctl start postgresql
```

**Error: "database "helpdeskpro" does not exist"**


# Create the database
psql -U postgres -c "CREATE DATABASE helpdeskpro;"

# Then run migrations
npx prisma migrate dev --name init
```

### Prisma/TypeScript Issues

**Error: "Prisma Client not initialized"**


# Regenerate Prisma Client
npx prisma generate

# Or reinstall Prisma
npm install @prisma/client@latest
```

**Error: "Cannot find module @prisma/client"**


# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Regenerate client
npx prisma generate
```

### Authentication Issues

**Error: "JWS invalid" or "Invalid token"**


# Clear browser cookies
# Open DevTools (F12) → Application → Cookies → Delete all for localhost:3000

# Restart development server
npm run dev
```

**Error: "No authenticated" on protected routes**

1. Verify `.env.local` has `JWT_SECRET` set
2. Check that login was successful
3. Clear cookies and try logging in again

### Tailwind CSS Not Loading

**Styles not appearing**


# Verify globals.css is imported in layout.tsx
# Check .env.local is correctly configured

# Restart development server
# Press Ctrl+C
npm run dev

# Or rebuild
npm run build
npm run start
```

### Port Already in Use

**Error: "Port 3000 is already in use"**


# Change port
PORT=3001 npm run dev

# Or kill process using port 3000
# Windows: netstat -ano | findstr :3000
# macOS/Linux: lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill
```

---

##  Database Management

### Reset Database ( Deletes All Data)

```bash
npx prisma migrate reset

# Confirms you want to:
# 1. Drop database
# 2. Create new database
# 3. Run all migrations
# 4. Run seed script (if exists)
```

### Explore Database with Prisma Studio

```bash
npx prisma studio

# Opens GUI at http://localhost:5555
# Browse, create, update, and delete records visually
```

### View Database Directly

```bash
psql -U postgres -d helpdeskpro

# List tables
\dt

# Query users
SELECT * FROM "User";

# Exit
\q
```

---

##  Creating New Migrations

When you modify `prisma/schema.prisma`:

```bash
# Create migration
npx prisma migrate dev --name describe_your_change


### Self-Hosted (Linux/Server)

```bash
# Install Node.js and PostgreSQL on server
# Clone repository
git clone <url>
cd nextjs-Prueba-Desempe-o

# Install dependencies
npm install --production

# Set environment variables
echo 'DATABASE_URL=...' > .env.local
echo 'JWT_SECRET=...' >> .env.local

# Run migrations
npx prisma migrate deploy

# Build production
npm run build

# Start server (use PM2 or similar for persistence)
npm start
```

---

##  Testing

### Manual Testing

1. **Create Account**: Register new user from `/register`
2. **Create Ticket**: Navigate to dashboard and create ticket
3. **Add Comment**: Open ticket and add comment
4. **Change Status**: (Agent only) Change ticket status
5. **Logout**: Clear session and login as different role

### Test Scenarios

| Scenario | Expected Result |
|----------|-----------------|
| Client creates ticket | Ticket appears in dashboard |
| Agent views all tickets | All tickets visible to agent |
| Client edits own ticket | Can update title/description |
| Agent updates status | Status changes in real-time |
| Add comment to ticket | Comment appears immediately |
| Logout and login | Session restored from cookie |

---

##  Support & Issues

If you encounter issues:

1. Check `Troubleshooting` section above
2. Verify `.env.local` configuration
3. Ensure PostgreSQL is running: `pg_isready`
4. Check database exists: `psql -U postgres -l`
5. Review server logs: Check terminal output for errors

---

##  License

MIT License - Feel free to use this project for personal or commercial purposes.

---

##  Future Enhancements

- [ ] Email notifications for ticket updates
- [ ] File attachments to tickets and comments
- [ ] Ticket priority queue
- [ ] Service level agreements (SLA)
- [ ] Knowledge base/FAQ section
- [ ] Chat support for real-time assistance
- [ ] Multi-language support
- [ ] Dark/Light theme toggle
- [ ] Analytics dashboard
- [ ] Mobile app

---

## 👨‍💻 Author

Developed with Andres Armenta as a modern example of Next.js + Prisma + PostgreSQL integration.

---
