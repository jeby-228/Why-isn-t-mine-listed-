<script lang="ts">
	import { page } from '$app/stores';
	import { HomeIcon } from '@lucide/svelte';
	import { resolve } from '$app/paths';
</script>

<div class="flex min-h-screen items-center justify-center px-4">
	<div class="w-full max-w-md text-center">
		<div class="mb-8 flex justify-center">
			<img src="/assets/errorPage/errorPhoto-1.jpg" alt="ErrorPhoto" class="h-60 w-120" />
		</div>

		<h1 class="mb-2 text-5xl font-bold text-surface-900 dark:text-surface-100">
			{$page.status}
		</h1>

		<h2 class="mb-4 text-2xl font-semibold text-surface-800 dark:text-surface-200">
			{$page.error?.message || 'An unexpected error has occurred.'}
		</h2>

		<div class="flex justify-center gap-4">
			<a href={resolve('/')} class="btn flex items-center gap-2 preset-filled">
				<HomeIcon class="h-4 w-4" />
				go back home page
			</a>
		</div>
	</div>
</div>
