import { deLocalizeUrl } from '$lib/paraglide/runtime';

export const reroute: import('@sveltejs/kit').Reroute = (request) =>
	deLocalizeUrl(request.url).pathname;
