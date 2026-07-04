<script lang="ts">
	// vercel speed insights and analytics
	import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit';
	import { injectAnalytics } from '@vercel/analytics/sveltekit';
	injectSpeedInsights();
	injectAnalytics();
	// vercel speed insights and analytics
	// google analytics 4
	import { page } from '$app/stores';
	import { trackPageView } from '$lib/analytics';
	$effect(() => {
		trackPageView($page.url.pathname);
	});
	// google analytics 4
	import './layout.css';
	import AppHeader from '$lib/components/AppHeader.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';

	let { children } = $props();
	let showSidebar = $state(false);
	let showSearch = $state(false);
	let searchQuery = $state('');
</script>

<AppHeader bind:showSearch bind:searchQuery onMenuToggle={() => (showSidebar = !showSidebar)} />

<div class="relative flex h-[calc(100vh-4rem)]">
	<Sidebar bind:show={showSidebar} />
	<!-- Main Content -->
	<main class="flex-1 overflow-y-auto p-4">
		{@render children()}
	</main>
</div>
