interface Entry<T> {
	data: T;
	expiresAt: number;
}

const bySlugCache = new Map<string, Entry<unknown>>();
const activeCache = new Map<string, Entry<unknown>>();
const userIdToUsername = new Map<string, string>();
const availabilityCache = new Map<string, Entry<unknown>>();

const TTL_MS = 2 * 60 * 1000;
const AVAIL_TTL_MS = 30 * 60 * 1000;

export function getBySlug<T>(username: string, slug: string): T | null {
	const hit = bySlugCache.get(`${username}:${slug}`);
	if (hit && hit.expiresAt > Date.now()) return hit.data as T;
	return null;
}

export function setBySlug<T>(username: string, slug: string, userId: string, data: T) {
	userIdToUsername.set(userId, username);
	bySlugCache.set(`${username}:${slug}`, { data, expiresAt: Date.now() + TTL_MS });
}

export function getActive<T>(username: string): T | null {
	const hit = activeCache.get(username);
	if (hit && hit.expiresAt > Date.now()) return hit.data as T;
	return null;
}

export function setActive<T>(username: string, userId: string, data: T) {
	userIdToUsername.set(userId, username);
	activeCache.set(username, { data, expiresAt: Date.now() + TTL_MS });
}

export function invalidateForUser(userId: string) {
	const username = userIdToUsername.get(userId);
	if (!username) return;
	for (const key of bySlugCache.keys()) {
		if (key.startsWith(`${username}:`)) bySlugCache.delete(key);
	}
	activeCache.delete(username);
}

export function getAvailability<T>(userId: string): T | null {
	const hit = availabilityCache.get(userId);
	if (hit && hit.expiresAt > Date.now()) return hit.data as T;
	return null;
}

export function setAvailability<T>(userId: string, data: T) {
	availabilityCache.set(userId, { data, expiresAt: Date.now() + AVAIL_TTL_MS });
}

export function invalidateAvailability(userId: string) {
	availabilityCache.delete(userId);
}
