<script lang="ts">
	import { page } from '$app/state';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Empty from '$lib/components/ui/empty/index.js';
	import * as m from '$lib/paraglide/messages';
	import { Clock } from '@lucide/svelte';
	import type { PageProps } from './$types';

	let { data, params }: PageProps = $props();

	type KnownSource = 'malt' | 'linkedin' | 'portfolio';

	const TITLES: Record<KnownSource, () => string> = {
		malt: m['home.title.malt'],
		linkedin: m['home.title.linkedin'],
		portfolio: m['home.title.portfolio']
	};
	const SUBTITLES: Record<KnownSource, () => string> = {
		malt: m['home.subtitle.malt'],
		linkedin: m['home.subtitle.linkedin'],
		portfolio: m['home.subtitle.portfolio']
	};

	function isKnownSource(s: string): s is KnownSource {
		return s in TITLES;
	}

	const username = $derived(params.username);
	const source = $derived(page.url.searchParams.get('from') ?? 'direct');
	const embed = $derived(page.url.searchParams.get('embed') === '1');
	const title = $derived(isKnownSource(source) ? TITLES[source]() : m['home.title.default']());
	const subtitle = $derived(
		isKnownSource(source) ? SUBTITLES[source]() : m['home.subtitle.default']()
	);

	const eventTypes = $derived(data.eventTypes);

	function eventHref(slug: string) {
		const p = new URLSearchParams();
		if (source !== 'direct') p.set('from', source);
		if (embed) p.set('embed', '1');
		const qs = p.toString();
		return `/${username}/${slug}${qs ? '?' + qs : ''}`;
	}
</script>

<div class="mx-auto max-w-2xl px-4 {embed ? 'py-8' : 'py-16'}">
	<div class="mb-12 text-center">
		<h1 class="text-4xl font-bold tracking-tight">{title}</h1>
		<p class="mt-3 text-lg text-muted-foreground">{subtitle}</p>
	</div>

	{#if eventTypes.length === 0}
		<Empty.Root>
			<Empty.Header>
				<Empty.Title>{m['home.empty.title']()}</Empty.Title>
				<Empty.Description>{m['home.empty.description']()}</Empty.Description>
			</Empty.Header>
		</Empty.Root>
	{:else}
		<div class="flex flex-col gap-4">
			{#each eventTypes as et}
				<Card.Root>
					<Card.Content class="flex items-center justify-between gap-4 py-6">
						<div class="flex-1">
							<div class="flex items-center gap-2">
								<Card.Title>{et.name}</Card.Title>
								{#if et.isBusyMode}
									<Badge variant="secondary">{m['home.limited_slots']()}</Badge>
								{/if}
							</div>
							{#if et.description}
								<Card.Description class="mt-1">{et.description}</Card.Description>
							{/if}
							<div class="mt-3 flex items-center gap-1 text-sm text-muted-foreground">
								<Clock class="size-4" />
								<span>{et.duration} min</span>
							</div>
						</div>
						<Button href={eventHref(et.slug)}>
							{m['home.book']()}
						</Button>
					</Card.Content>
				</Card.Root>
			{/each}
		</div>
	{/if}
</div>
