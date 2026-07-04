<script lang="ts">
	import { slide } from 'svelte/transition';

	let { show = $bindable(), query = $bindable('') } = $props();
</script>

{#if show}
	<div transition:slide={{ duration: 200 }} class="px-4 pb-4">
		<input type="search" bind:value={query} placeholder="Search..." class="input w-full" />
	</div>
{/if}
