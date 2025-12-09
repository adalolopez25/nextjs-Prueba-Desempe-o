import type { NextApiRequest, NextApiResponse } from 'next';
import { findUserByCredentials } from '@/lib/data';
import { ApiResponse } from '@/types';

export default function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'Email and password required' });
  }

  const user = findUserByCredentials(email, password);

  if (!user) {
    return res.status(401).json({ success: false, error: 'Invalid credentials' });
  }

  // Remove password from response
  const { password: _, ...userWithoutPassword } = user;
  
  res.status(200).json({ success: true, data: userWithoutPassword });
}