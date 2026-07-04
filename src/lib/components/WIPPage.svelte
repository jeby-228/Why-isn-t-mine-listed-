<script lang="ts">
	let { title = '網頁施工中', message = '此頁面正在開發中，敬請期待！' } = $props();
</script>

<div class="flex min-h-[70vh] items-center justify-center p-4">
	<div class="space-y-6 text-center">
		<div class="flex justify-center">
			<img src="/assets/errorPage/WIPPhoto-1.gif" alt="網頁施工中" class="h-48 w-48" />
		</div>

		<div class="space-y-2">
			<h1 class="text-surface-900-50 text-4xl font-bold">{title}</h1>
			<p class="text-surface-600-300 text-lg">{message}</p>
		</div>

		<div class="flex justify-center gap-2">
			<span class="size-2 animate-bounce rounded-full bg-warning-500 [animation-delay:0ms]"></span>
			<span class="size-2 animate-bounce rounded-full bg-warning-500 [animation-delay:150ms]"
			></span>
			<span class="size-2 animate-bounce rounded-full bg-warning-500 [animation-delay:300ms]"
			></span>
		</div>
	</div>
</div>
