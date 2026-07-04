<script lang="ts">
	import { PenLineIcon, UploadIcon } from '@lucide/svelte';

	type SignatureMode = 'draw' | 'upload';

	let { signatureDataUrl = $bindable('') } = $props();

	let mode = $state<SignatureMode>('draw');
	let canvas = $state<HTMLCanvasElement | null>(null);
	let isDrawing = $state(false);
	let hasDrawn = $state(false);
	let uploadPreview = $state('');

	const CANVAS_WIDTH = 480;
	const CANVAS_HEIGHT = 160;

	function getContext() {
		return canvas?.getContext('2d') ?? null;
	}

	function setupCanvas() {
		const ctx = getContext();
		if (!ctx || !canvas) return;

		const dpr = window.devicePixelRatio || 1;
		canvas.width = CANVAS_WIDTH * dpr;
		canvas.height = CANVAS_HEIGHT * dpr;
		canvas.style.width = `${CANVAS_WIDTH}px`;
		canvas.style.height = `${CANVAS_HEIGHT}px`;
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		ctx.strokeStyle = '#111';
		ctx.lineWidth = 2;
		ctx.lineCap = 'round';
		ctx.lineJoin = 'round';
		fillBackground(ctx);
	}

	function fillBackground(ctx: CanvasRenderingContext2D) {
		ctx.fillStyle = '#fff';
		ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
	}

	function getPoint(event: MouseEvent | TouchEvent) {
		if (!canvas) return { x: 0, y: 0 };

		const rect = canvas.getBoundingClientRect();
		if ('touches' in event) {
			const touch = event.touches[0] ?? event.changedTouches[0];
			return { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
		}
		return { x: event.clientX - rect.left, y: event.clientY - rect.top };
	}

	function startDrawing(event: MouseEvent | TouchEvent) {
		event.preventDefault();
		const ctx = getContext();
		if (!ctx) return;

		isDrawing = true;
		const { x, y } = getPoint(event);
		ctx.beginPath();
		ctx.moveTo(x, y);
	}

	function draw(event: MouseEvent | TouchEvent) {
		if (!isDrawing) return;
		event.preventDefault();

		const ctx = getContext();
		if (!ctx) return;

		const { x, y } = getPoint(event);
		ctx.lineTo(x, y);
		ctx.stroke();
		hasDrawn = true;
	}

	function stopDrawing() {
		if (!isDrawing) return;
		isDrawing = false;
		syncDrawnSignature();
	}

	function syncDrawnSignature() {
		if (mode === 'draw' && hasDrawn && canvas) {
			signatureDataUrl = canvas.toDataURL('image/png');
		}
	}

	function clearSignature() {
		hasDrawn = false;
		uploadPreview = '';
		signatureDataUrl = '';

		const ctx = getContext();
		if (ctx) {
			fillBackground(ctx);
		}
	}

	function switchMode(nextMode: SignatureMode) {
		if (nextMode === mode) return;
		clearSignature();
		mode = nextMode;
	}

	function handleUpload(event: Event) {
		const input = event.currentTarget as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;

		if (!file.type.startsWith('image/')) {
			input.value = '';
			return;
		}

		const reader = new FileReader();
		reader.onload = () => {
			const result = reader.result as string;
			uploadPreview = result;
			signatureDataUrl = result;
		};
		reader.readAsDataURL(file);
	}

	$effect(() => {
		if (canvas && mode === 'draw') {
			setupCanvas();
		}
	});

	$effect(() => {
		if (!signatureDataUrl) {
			hasDrawn = false;
			uploadPreview = '';
			const ctx = getContext();
			if (ctx && mode === 'draw') {
				fillBackground(ctx);
			}
		}
	});
</script>

<div class="w-full space-y-3">
	<div class="flex flex-wrap gap-2">
		<button
			type="button"
			class="btn btn-sm {mode === 'draw' ? 'preset-filled' : 'preset-tonal'}"
			onclick={() => switchMode('draw')}
		>
			<PenLineIcon class="size-4" />
			手寫簽名
		</button>
		<button
			type="button"
			class="btn btn-sm {mode === 'upload' ? 'preset-filled' : 'preset-tonal'}"
			onclick={() => switchMode('upload')}
		>
			<UploadIcon class="size-4" />
			上傳簽名
		</button>
	</div>

	{#if mode === 'draw'}
		<div class="space-y-2">
			<div
				class="overflow-hidden rounded-lg border border-surface-300-700 bg-white"
				style="touch-action: none;"
			>
				<canvas
					bind:this={canvas}
					class="block cursor-crosshair"
					onmousedown={startDrawing}
					onmousemove={draw}
					onmouseup={stopDrawing}
					onmouseleave={stopDrawing}
					ontouchstart={startDrawing}
					ontouchmove={draw}
					ontouchend={stopDrawing}
					aria-label="手寫簽名區域"
				></canvas>
			</div>
			<p class="text-xs text-surface-500">請在上方空白處手寫簽名</p>
		</div>
	{:else}
		<div class="space-y-2">
			<label
				class="flex min-h-40 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-surface-300-700 bg-surface-50-950 px-4 py-6 transition-colors hover:bg-surface-100-900"
			>
				<UploadIcon class="size-8 text-surface-400" />
				<span class="text-surface-600-300 text-sm">點擊上傳簽名圖片（PNG、JPG）</span>
				<input
					type="file"
					accept="image/png,image/jpeg,image/webp"
					class="sr-only"
					onchange={handleUpload}
				/>
			</label>
			{#if uploadPreview}
				<div class="rounded-lg border border-surface-200-800 bg-white p-3">
					<img src={uploadPreview} alt="已上傳的簽名預覽" class="mx-auto max-h-24 object-contain" />
				</div>
			{/if}
		</div>
	{/if}

	<div class="flex justify-end">
		<button type="button" class="btn preset-tonal btn-sm" onclick={clearSignature}>清除簽名</button>
	</div>
</div>
