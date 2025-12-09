import type { NextApiRequest, NextApiResponse } from 'next';
import { getCommentsByTicket, addComment, comments } from '@/lib/data';
import { ApiResponse } from '@/types';

export default function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  if (req.method === 'GET') {
    const { ticketId } = req.query;
    
    if (ticketId) {
      const ticketComments = getCommentsByTicket(ticketId as string);
      return res.status(200).json({ success: true, data: ticketComments });
    }
    
    return res.status(200).json({ success: true, data: comments });
  }

  if (req.method === 'POST') {
    const { ticketId, author, message } = req.body;

    if (!ticketId || !author || !message) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    const newComment = addComment({ ticketId, author, message });
    return res.status(201).json({ success: true, data: newComment });
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
}