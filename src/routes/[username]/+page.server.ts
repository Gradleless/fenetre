import { loadActiveEventTypes } from '$lib/server/public-queries';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	return { eventTypes: await loadActiveEventTypes(params.username) };
};
