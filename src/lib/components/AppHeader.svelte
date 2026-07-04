<script lang="ts">
	import { CalendarIcon, CircleUserIcon, MenuIcon, SearchIcon } from '@lucide/svelte';
	import { AppBar } from '@skeletonlabs/skeleton-svelte';
	import { resolve } from '$app/paths';
	import ThemeSwitcher from '$lib/components/ThemeSwitcher.svelte';
	import SearchBar from '$lib/components/SearchBar.svelte';

	let {
		onMenuToggle,
		showSearch = $bindable(false),
		searchQuery = $bindable('')
	}: {
		onMenuToggle?: () => void;
		showSearch?: boolean;
		searchQuery?: string;
	} = $props();

	function handleSearchToggle() {
		showSearch = !showSearch;
		if (!showSearch) {
			searchQuery = '';
		}
	}
</script>

<AppBar>
	<AppBar.Toolbar class="grid-cols-[auto_1fr_auto]">
		<AppBar.Lead>
			<button
				type="button"
				class="btn-icon btn-icon-lg hover:preset-tonal"
				onclick={onMenuToggle}
				aria-label="切換選單"
			>
				<MenuIcon />
			</button>
		</AppBar.Lead>
		<AppBar.Headline>
			<a href={resolve('/')} class="text-2xl transition-opacity hover:opacity-80"> Jeby Website </a>
		</AppBar.Headline>
		<AppBar.Trail>
			<ThemeSwitcher />
			<button
				type="button"
				class="btn-icon hover:preset-tonal"
				onclick={handleSearchToggle}
				aria-label="搜尋"
			>
				<SearchIcon class="size-6" />
			</button>
			<button type="button" class="btn-icon hover:preset-tonal" aria-label="行事曆">
				<CalendarIcon class="size-6" />
			</button>
			<a
				href={resolve('/profile' as '/')}
				class="btn-icon hover:preset-tonal"
				aria-label="使用者資料"
			>
				<CircleUserIcon class="size-6" />
			</a>
		</AppBar.Trail>
	</AppBar.Toolbar>
	<SearchBar bind:show={showSearch} bind:query={searchQuery} />
</AppBar>
