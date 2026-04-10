import { RateLimiter } from 'sveltekit-rate-limiter/server';
import { CloudflareIPRateLimiter } from 'sveltekit-rate-limiter/server/limiters';

// Used for public booking actions that trigger emails and calendar events
export const bookingLimiter = new RateLimiter({
	plugins: [new CloudflareIPRateLimiter([5, '15m'])]
});

// Used for cheaper public writes (brief, waitlist)
export const formLimiter = new RateLimiter({
	plugins: [new CloudflareIPRateLimiter([10, '10m'])]
});
