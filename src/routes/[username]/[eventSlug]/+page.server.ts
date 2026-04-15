import { loadEventTypeBySlug, loadAvailableSlots } from '$lib/server/public-queries';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const { username, eventSlug } = params;
	const [eventType, slots] = await Promise.all([
		loadEventTypeBySlug(username, eventSlug),
		loadAvailableSlots(username, eventSlug)
	]);
	return { eventType, slots };
};
