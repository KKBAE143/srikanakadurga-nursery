import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
    const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;

    if (!privateKey || !publicKey) {
      console.error('ImageKit keys not configured');
      return res.status(500).json({ error: 'ImageKit not configured' });
    }

    const token = uuidv4();
    const expire = Math.floor(Date.now() / 1000) + 2400; // 40 minutes from now
    const signature = crypto
      .createHmac('sha1', privateKey)
      .update(token + expire)
      .digest('hex');

    return res.status(200).json({
      token,
      expire,
      signature,
      publicKey,
    });
  } catch (error) {
    console.error('ImageKit auth error:', error);
    return res.status(500).json({ error: 'Failed to generate authentication parameters' });
  }
}
