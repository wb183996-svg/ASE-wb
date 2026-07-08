import { Request, Response, NextFunction } from 'express';
import { adminAuth } from '../lib/firebase-admin.ts';

export interface AuthRequest extends Request {
  user?: any;
}

export const requireAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing token' });
  }

  const token = authHeader.split('Bearer ')[1];

  // Gracefully handle simulated dev/preview tokens
  if (token.startsWith('github_oauth_sec_token_') || token.includes('ase_oauth_sec_jwt_')) {
    try {
      if (token.includes('.')) {
        const parts = token.split('.');
        const payloadDecoded = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf-8'));
        req.user = {
          uid: payloadDecoded.sub,
          email: payloadDecoded.email,
          name: payloadDecoded.name,
          role: payloadDecoded.role
        };
      } else {
        req.user = {
          uid: 'simulated-user',
          email: 'simulated@ase.internal',
          name: 'Simulated User',
          role: 'User'
        };
      }
      return next();
    } catch (e) {
      console.error('Error decoding simulated token:', e);
      req.user = {
        uid: 'simulated-user',
        email: 'simulated@ase.internal',
        name: 'Simulated User',
        role: 'User'
      };
      return next();
    }
  }

  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Error verifying Firebase ID token:', error);
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};
