<script lang="ts">
	import { slide, fade } from 'svelte/transition';
	import { GithubIcon, UserIcon, SettingsIcon, HelpCircleIcon } from '@lucide/svelte';
	import { Navigation } from '@skeletonlabs/skeleton-svelte';
	import { resolve } from '$app/paths';
	import { page } from '$app/stores';
	import { env } from '$env/dynamic/public';
	import NowVersion from '$lib/components/NowVersion.svelte';

	let { show = $bindable() } = $props();
	let repo_name = env.PUBLIC_GITHUB_REPO;

	function isActive(path: string) {
		return $page.url.pathname === path;
	}

	function handleClick() {
		show = false;
	}
</script>

{#if show}
	<div
		transition:fade={{ duration: 200 }}
		class="fixed inset-0 top-16 z-30 bg-black/50"
		onclick={handleClick}
		role="presentation"
		aria-hidden="true"
	></div>

	<div
		transition:slide={{ duration: 300, axis: 'x' }}
		class="fixed top-16 left-0 z-40 h-[calc(100vh-4rem)] w-64"
	>
		<Navigation layout="sidebar" class="flex h-full flex-col">
			<Navigation.Header>
				<h2 class="text-lg font-bold">Menu</h2>
			</Navigation.Header>
			<Navigation.Content class="flex-1">
				<Navigation.Group>
					<Navigation.Label>Main</Navigation.Label>
					<Navigation.Menu>
						<Navigation.TriggerAnchor
							href={resolve('/about' as '/')}
							class={isActive('/about') ? 'preset-filled' : ''}
							onclick={handleClick}
						>
							<UserIcon class="mr-2 size-5" />
							<Navigation.TriggerText>About</Navigation.TriggerText>
						</Navigation.TriggerAnchor>
					</Navigation.Menu>
				</Navigation.Group>
				<Navigation.Group>
					<Navigation.Label>Settings</Navigation.Label>
					<Navigation.Menu>
						<Navigation.TriggerAnchor
							href={resolve('/preferences' as '/')}
							class={isActive('/preferences') ? 'preset-filled' : ''}
							onclick={handleClick}
						>
							<SettingsIcon class="mr-2 size-5" />
							<Navigation.TriggerText>Preferences</Navigation.TriggerText>
						</Navigation.TriggerAnchor>
						<Navigation.TriggerAnchor
							href={resolve('/help' as '/')}
							class={isActive('/help') ? 'preset-filled' : ''}
							onclick={handleClick}
						>
							<HelpCircleIcon class="mr-2 size-5" />
							<Navigation.TriggerText>Help & Support</Navigation.TriggerText>
						</Navigation.TriggerAnchor>
					</Navigation.Menu>
				</Navigation.Group>
			</Navigation.Content>
			<Navigation.Footer class="mt-auto">
				<div class="border-t border-surface-700 pt-4">
					<div class="flex items-center gap-3 px-4 py-2">
						<div class="flex-1">
							<p class="text-sm font-semibold">Jeby</p>
							<p class="text-xs text-surface-400">Developer</p>
						</div>
						<a
							href={repo_name}
							target="_blank"
							rel="noopener noreferrer"
							class="btn-icon hover:preset-tonal"
							aria-label="GitHub Repository"
						>
							<GithubIcon class="size-5" />
						</a>
					</div>
					<div class="px-4 pb-2">
						<NowVersion />
					</div>
				</div>
			</Navigation.Footer>
		</Navigation>
	</div>
{/if}
