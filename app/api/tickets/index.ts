import type { NextApiRequest, NextApiResponse } from 'next';
import { getTicketsByUser, addTicket, tickets } from '@/lib/data';
import { ApiResponse, Ticket, UserRole } from '@/types';

export default function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  if (req.method === 'GET') {
    const { userId, role } = req.query;
    
    if (!userId || !role) {
      return res.status(200).json({ success: true, data: tickets });
    }
    
    const userTickets = getTicketsByUser(userId as string, role as UserRole);
    return res.status(200).json({ success: true, data: userTickets });
  }

  if (req.method === 'POST') {
    const { title, description, createdBy, priority } = req.body;

    if (!title || !description || !createdBy) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    const newTicket = addTicket({
      title,
      description,
      createdBy,
      priority: priority || 'medium',
      status: 'open'
    });

    return res.status(201).json({ success: true, data: newTicket });
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
}