export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'agent' | 'client';
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  userId: string;
  createdAt: string;
  user?: {
    name: string;
    email: string;
  };
}

export interface Comment {
  id: string;
  content: string;
  userId: string;
  ticketId: string;
  createdAt: string;
  user?: {
    name: string;
  };
}