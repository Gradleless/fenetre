import { loadBookingByToken, loadAvailableSlots } from '$lib/server/public-queries';
import type { PageServerLoad } from './$types';

type Slots = Record<string, { start: string; end: string }[]>;

export const load: PageServerLoad = async ({ params }) => {
	const booking = await loadBookingByToken(params.token).catch(() => null);

	const slots: Slots = booking?.username
		? await loadAvailableSlots(booking.username, booking.eventType.slug)
		: {};

	return { booking, slots };
};
