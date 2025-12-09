import type { NextApiRequest, NextApiResponse } from 'next';
import { updateTicket, tickets } from '@/lib/data';
import { ApiResponse } from '@/types';

export default function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  const { id } = req.query;

  if (req.method === 'GET') {
    const ticket = tickets.find(t => t.id === id);
    
    if (!ticket) {
      return res.status(404).json({ success: false, error: 'Ticket not found' });
    }
    
    return res.status(200).json({ success: true, data: ticket });
  }

  if (req.method === 'PUT') {
    const { status, priority, assignedTo } = req.body;
    
    const updated = updateTicket(id as string, { status, priority, assignedTo });
    
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Ticket not found' });
    }
    
    return res.status(200).json({ success: true, data: updated });
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
}