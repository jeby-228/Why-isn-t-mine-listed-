<script lang="ts">
	import { browser } from '$app/environment';
	import { PaletteIcon } from 'lucide-svelte';

	// 可用的主題列表
	const themes = [
		{ name: 'cerberus', label: 'Cerberus 🤖' },
		{ name: 'mona', label: 'Mona 🐙' },
		{ name: 'vox', label: 'Vox 👾' }
		// approximately 20 themes available in Skeleton, you can add more here as needed
	];

	let currentTheme = $state(browser ? localStorage.getItem('theme') || 'cerberus' : 'cerberus');

	// 切換主題
	function setTheme(theme: string) {
		if (browser) {
			currentTheme = theme;
			document.documentElement.setAttribute('data-theme', theme);
			localStorage.setItem('theme', theme);
		}
	}

	// 初始化主題
	$effect(() => {
		if (browser && currentTheme) {
			document.documentElement.setAttribute('data-theme', currentTheme);
		}
	});
</script>

<div class="relative">
	<button
		type="button"
		class="btn-icon hover:preset-tonal"
		aria-label="切換主題"
		onclick={() => {
			const currentIndex = themes.findIndex((t) => t.name === currentTheme);
			const nextIndex = (currentIndex + 1) % themes.length;
			setTheme(themes[nextIndex].name);
		}}
	>
		<PaletteIcon class="size-6" />
	</button>
</div>
