import { User, Ticket, Comment } from '@/types';

// Datos iniciales
export let users: User[] = [
  {
    id: '1',
    name: 'Cliente Ejemplo',
    email: 'cliente@example.com',
    role: 'client',
    password: 'cliente123'
  },
  {
    id: '2',
    name: 'Agente Soporte',
    email: 'agente@example.com',
    role: 'agent',
    password: 'agente123'
  }
];

export let tickets: Ticket[] = [
  {
    id: '1',
    title: 'Error en login',
    description: 'No puedo iniciar sesión en el sistema',
    createdBy: '1',
    assignedTo: '2',
    status: 'in_progress',
    priority: 'high',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Problema con impresora',
    description: 'La impresora no responde',
    createdBy: '1',
    status: 'open',
    priority: 'medium',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export let comments: Comment[] = [
  {
    id: '1',
    ticketId: '1',
    author: '2',
    message: 'Estamos revisando el problema',
    createdAt: new Date().toISOString()
  }
];

// Helper functions
export const getTicketsByUser = (userId: string, role: UserRole) => {
  if (role === 'client') {
    return tickets.filter(ticket => ticket.createdBy === userId);
  }
  return tickets;
};

export const addTicket = (ticket: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>) => {
  const newTicket: Ticket = {
    ...ticket,
    id: (tickets.length + 1).toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  tickets.push(newTicket);
  return newTicket;
};

export const updateTicket = (id: string, updates: Partial<Ticket>) => {
  const index = tickets.findIndex(t => t.id === id);
  if (index === -1) return null;
  
  tickets[index] = {
    ...tickets[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  return tickets[index];
};

export const addComment = (comment: Omit<Comment, 'id' | 'createdAt'>) => {
  const newComment: Comment = {
    ...comment,
    id: (comments.length + 1).toString(),
    createdAt: new Date().toISOString()
  };
  comments.push(newComment);
  return newComment;
};

export const getCommentsByTicket = (ticketId: string) => {
  return comments.filter(comment => comment.ticketId === ticketId);
};

export const findUserByCredentials = (email: string, password: string) => {
  return users.find(user => user.email === email && user.password === password);
};

export const findUserById = (id: string) => {
  return users.find(user => user.id === id);
};