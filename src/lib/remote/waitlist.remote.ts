import { command, getRequestEvent } from '$app/server';
import { db } from '$lib/server/db';
import { eventTypes, waitlist } from '$lib/server/db/schema';
import { formLimiter } from '$lib/server/limiter';
import { userIdByUsername } from '$lib/server/remote-helpers';
import { error } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import * as z from 'zod';

export const joinWaitlist = command(
	z.object({
		username: z.string(),
		eventTypeSlug: z.string(),
		email: z.email(),
		name: z.string().optional()
	}),
	async ({ username, eventTypeSlug, email, name }) => {
		if (await formLimiter.isLimited(getRequestEvent())) error(429, 'Too many requests');
		const userId = await userIdByUsername(username);

		const [eventType] = await db
			.select()
			.from(eventTypes)
			.where(and(eq(eventTypes.userId, userId), eq(eventTypes.slug, eventTypeSlug)))
			.limit(1);

		if (!eventType) error(400, 'Event type not found');

		await db.insert(waitlist).values({ eventTypeId: eventType.id, email, name });
		return { ok: true };
	}
);
