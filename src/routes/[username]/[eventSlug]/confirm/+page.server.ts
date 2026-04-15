import { loadBookingConfirmation, loadPublicPortfolioLinks } from '$lib/server/public-queries';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, url }) => {
	const bookingId = url.searchParams.get('id') ?? '';
	if (!bookingId) return { booking: null, portfolioLinks: [] };

	const [booking, allLinks] = await Promise.all([
		loadBookingConfirmation(bookingId).catch(() => null),
		loadPublicPortfolioLinks(params.username)
	]);

	const portfolioLinks = (allLinks ?? []).filter(
		(l) => l.missionType === 'all' || l.missionType === booking?.missionType
	);

	return { booking, portfolioLinks };
};
