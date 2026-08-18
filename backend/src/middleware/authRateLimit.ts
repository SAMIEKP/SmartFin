import { Request, Response, NextFunction } from 'express';

type Counter = { count: number; resetAt: number };

const counters = new Map<string, Counter>();

export const rateLimit = (name: string, limit: number, windowMs: number, keyFor: (req: Request) => string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const now = Date.now();
    const key = `${name}:${keyFor(req)}`;
    const current = counters.get(key);
    const counter = !current || current.resetAt <= now
      ? { count: 0, resetAt: now + windowMs }
      : current;

    counter.count += 1;
    counters.set(key, counter);

    if (counter.count > limit) {
      const retryAfter = Math.max(1, Math.ceil((counter.resetAt - now) / 1000));
      res.setHeader('Retry-After', retryAfter);
      return res.status(429).json({
        error: 'Too Many Requests',
        message: 'Too many attempts. Please wait and try again.',
      });
    }

    // Keep expired entries from growing indefinitely in this single-process limiter.
    if (counters.size > 10000) {
      for (const [entryKey, entry] of counters) {
        if (entry.resetAt <= now) counters.delete(entryKey);
      }
    }

    next();
  };
};

export const requestKey = (req: Request) => req.ip || req.socket.remoteAddress || 'unknown';
export const emailKey = (req: Request) => `${requestKey(req)}:${String(req.body?.email || '').trim().toLowerCase()}`;
export const verificationKey = (req: Request) => `${requestKey(req)}:${String(req.body?.verificationId || '')}`;