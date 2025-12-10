// lib/services.ts
import axios from 'axios';
import { Ticket, Comment } from '@/types';

const BASE = process.env.NEXT_PUBLIC_API_URL || '';

const api = axios.create({
  baseURL: BASE,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor to add token
api.interceptors.request.use((config) => {
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (raw && config?.headers) {
      config.headers.Authorization = `Bearer ${raw}`;
    }
  } catch (err) {
    // ignore in SSR
  }
  return config;
}, (error) => Promise.reject(error));

export const authService = {
  login: (email: string, password: string) => api.post('/api/auth/login', { email, password }),
};

export const ticketService = {
  getAll: () => api.get('/api/tickets'),
  getByUser: (userId: string) => api.get(`/api/tickets?userId=${userId}&role=client`),
  getById: (id: string) => api.get(`/api/tickets/${id}`),
  create: (payload: Partial<Ticket>) => api.post('/api/tickets', payload),
  update: (id: string, payload: Partial<Ticket>) => api.put(`/api/tickets/${id}`, payload),
};

export const commentService = {
  getByTicket: (ticketId: string) => api.get(`/api/comments?ticketId=${ticketId}`),
  create: (ticketId: string, author: string, message: string) => api.post('/api/comments', { ticketId, author, message }),
};

export default api;
