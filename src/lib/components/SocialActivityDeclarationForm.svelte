<script lang="ts">
	import SignatureField from '$lib/components/SignatureField.svelte';
	import {
		downloadPdfBlob,
		exportDeclarationPdf,
		type DeclarationPdfData
	} from '$lib/exportDeclarationPdf';

	const declarationItems = [
		'本人已充分知悉並理解公司之職場友善原則。',
		'對於辦公室日常之社交訂購活動（如訂飲料、點心等），本人目前基於個人飲食習慣、健康管理或其他個人考量，選擇不參與。',
		'前述決定完全出自本人之自由意志，未受到公司任何管理階層、主管或同仁之強迫、威脅、利誘或不當施壓。',
		'公司已明確告知，本人隨時可依個人意願改變此決定，且此決定絕不影響本人於公司之績效考核、職涯發展及勞動權益。'
	];

	function getTodayDateValue() {
		const now = new Date();
		const year = now.getFullYear();
		const month = String(now.getMonth() + 1).padStart(2, '0');
		const day = String(now.getDate()).padStart(2, '0');
		return `${year}-${month}-${day}`;
	}

	let name = $state('');
	let department = $state('');
	let agreedItems = $state<boolean[]>(declarationItems.map(() => false));
	let signatureDataUrl = $state('');
	let declarationDate = $state(getTodayDateValue());
	let submitted = $state(false);
	let submittedData = $state<DeclarationPdfData | null>(null);
	let pdfExported = $state(false);
	let isExportingPdf = $state(false);
	let pdfDownloadUrl = $state<string | null>(null);
	let pdfFilename = $state('');
	let exportError = $state('');
	let selectAllCheckbox = $state<HTMLInputElement | null>(null);

	const allAgreed = $derived(agreedItems.every(Boolean));
	const someAgreed = $derived(agreedItems.some(Boolean) && !allAgreed);
	const isValid = $derived(
		name.trim() !== '' &&
			department.trim() !== '' &&
			allAgreed &&
			signatureDataUrl !== '' &&
			declarationDate !== ''
	);

	const submittedSnapshot = $derived(submittedData);

	function createSubmittedData(): DeclarationPdfData {
		return {
			name: name.trim(),
			department: department.trim(),
			declarationItems,
			date: declarationDate,
			signatureDataUrl
		};
	}

	$effect(() => {
		if (selectAllCheckbox) {
			selectAllCheckbox.indeterminate = someAgreed;
		}
	});

	function toggleAllAgreed(checked: boolean) {
		agreedItems = declarationItems.map(() => checked);
	}

	function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		if (!isValid) return;
		submittedData = createSubmittedData();
		submitted = true;
		pdfExported = false;
	}

	function clearPdfDownloadUrl() {
		if (pdfDownloadUrl) {
			URL.revokeObjectURL(pdfDownloadUrl);
			pdfDownloadUrl = null;
		}
	}

	function handleReset() {
		name = '';
		department = '';
		agreedItems = declarationItems.map(() => false);
		signatureDataUrl = '';
		declarationDate = getTodayDateValue();
		submitted = false;
		submittedData = null;
		pdfExported = false;
		exportError = '';
		clearPdfDownloadUrl();
		pdfFilename = '';
	}

	async function handleExportPdf() {
		if (isExportingPdf || !submittedSnapshot) return;

		isExportingPdf = true;
		exportError = '';
		clearPdfDownloadUrl();

		try {
			const { blob, filename } = await exportDeclarationPdf(submittedSnapshot);
			pdfFilename = filename;
			pdfDownloadUrl = downloadPdfBlob(blob, filename);
			pdfExported = true;
		} catch (error) {
			exportError =
				error instanceof Error ? error.message : 'PDF 匯出失敗，請稍後再試或改用其他瀏覽器。';
		} finally {
			isExportingPdf = false;
		}
	}

	function skipPdfExport() {
		pdfExported = true;
	}
</script>

<div class="mx-auto w-full max-w-3xl">
	{#if submitted}
		<div class="space-y-6 card p-8 text-center">
			<div class="mx-auto flex size-16 items-center justify-center rounded-full bg-success-500/15">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="size-8 text-success-500"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					aria-hidden="true"
				>
					<path d="M20 6 9 17l-5-5" />
				</svg>
			</div>
			<div class="space-y-2">
				<h2 class="text-2xl font-bold">聲明書已提交</h2>
				<p class="text-surface-600-300">
					感謝 {submittedData?.name ?? name} 完成填寫。目前僅為前端預覽，後續將串接儲存功能。
				</p>
			</div>

			{#if !pdfExported}
				<div class="rounded-lg border border-surface-200-800 bg-surface-50-950 p-6 text-left">
					<h3 class="mb-2 text-lg font-semibold">是否要匯出成 PDF？</h3>
					<p class="text-surface-600-300 mb-4 text-sm">
						可將本次填寫內容與簽名匯出為 PDF 檔案，方便留存或列印。
					</p>
					<div class="flex flex-col gap-3 sm:flex-row">
						<button
							type="button"
							class="btn flex-1 preset-filled"
							disabled={isExportingPdf}
							onclick={handleExportPdf}
						>
							{isExportingPdf ? '匯出中…' : '匯出 PDF'}
						</button>
						<button type="button" class="btn flex-1 preset-tonal" onclick={skipPdfExport}>
							稍後再說
						</button>
					</div>
					{#if exportError}
						<p class="mt-3 text-sm text-error-500">{exportError}</p>
					{/if}
				</div>
			{:else}
				<div class="space-y-3">
					<p class="text-sm text-surface-500">PDF 已產生。若瀏覽器未自動下載，請點下方連結。</p>
					{#if pdfDownloadUrl}
						<a href={pdfDownloadUrl} download={pdfFilename} class="btn inline-flex preset-filled">
							下載 PDF
						</a>
					{/if}
					{#if exportError}
						<p class="text-sm text-error-500">{exportError}</p>
					{/if}
				</div>
				<button
					type="button"
					class="btn preset-tonal"
					onclick={handleExportPdf}
					disabled={isExportingPdf}
				>
					{isExportingPdf ? '匯出中…' : '再次匯出 PDF'}
				</button>
			{/if}

			<button type="button" class="btn preset-tonal" onclick={handleReset}>填寫另一份</button>
		</div>
	{:else}
		<form class="overflow-hidden card" onsubmit={handleSubmit}>
			<header class="border-b border-surface-200-800 px-6 py-8 text-center">
				<h1 class="text-2xl font-bold tracking-wide md:text-3xl">員工自主聲明書</h1>
				<p class="text-surface-600-300 mt-2">（辦公室日常社交活動參與意願）</p>
			</header>

			<div class="space-y-8 px-6 py-8">
				<p class="text-surface-700-200 leading-relaxed">
					為保障同仁個人自主權，凡公司內部之非公務日常社交活動（如：辦公室訂購飲品、下午茶、團購等），均以「完全自願」為原則。請詳閱以下聲明內容並確認：
				</p>

				<section aria-labelledby="personal-info-heading">
					<h2 id="personal-info-heading" class="sr-only">個人資料</h2>
					<div class="overflow-hidden rounded-lg border border-surface-200-800">
						<table class="w-full border-collapse text-sm md:text-base">
							<tbody>
								<tr class="border-b border-surface-200-800">
									<th
										scope="row"
										class="w-36 bg-surface-100-900 px-4 py-3 text-left font-semibold md:w-44"
									>
										立聲明書人
									</th>
									<td class="px-4 py-3">
										<label class="flex flex-wrap items-center gap-2">
											<span class="shrink-0">姓名：</span>
											<input
												type="text"
												bind:value={name}
												class="input min-w-0 flex-1"
												placeholder="請填寫姓名"
												required
											/>
										</label>
									</td>
								</tr>
								<tr>
									<th scope="row" class="bg-surface-100-900 px-4 py-3 text-left font-semibold">
										部門 / 職稱
									</th>
									<td class="px-4 py-3">
										<input
											type="text"
											bind:value={department}
											class="input w-full"
											placeholder="例：資訊部 / 工程師"
											required
										/>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</section>

				<section aria-labelledby="declaration-items-heading">
					<h2 id="declaration-items-heading" class="sr-only">聲明項目</h2>
					<div class="overflow-hidden rounded-lg border border-surface-200-800">
						<table class="w-full border-collapse text-sm md:text-base">
							<thead>
								<tr class="border-b border-surface-200-800 bg-surface-100-900">
									<th scope="col" class="w-16 px-4 py-3 text-left font-semibold">項目</th>
									<th scope="col" class="px-4 py-3 text-left font-semibold">聲明內容</th>
									<th scope="col" class="w-20 px-4 py-3 text-center font-semibold">
										<label class="inline-flex cursor-pointer flex-col items-center gap-1">
											<input
												bind:this={selectAllCheckbox}
												type="checkbox"
												class="checkbox size-5"
												checked={allAgreed}
												onchange={(e) => toggleAllAgreed(e.currentTarget.checked)}
												aria-label="全部勾選"
											/>
											<span class="text-xs font-normal">全部</span>
										</label>
									</th>
								</tr>
							</thead>
							<tbody>
								{#each declarationItems as item, index (index)}
									<tr class="border-b border-surface-200-800 last:border-b-0">
										<td class="px-4 py-4 align-top font-medium">{index + 1}</td>
										<td class="px-4 py-4 align-top leading-relaxed">{item}</td>
										<td class="px-4 py-4 text-center align-top">
											<input
												type="checkbox"
												class="checkbox size-5"
												bind:checked={agreedItems[index]}
												aria-label="確認項目 {index + 1}"
												required
											/>
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				</section>

				<section
					class="space-y-6 border-t border-surface-200-800 pt-6"
					aria-labelledby="signature-heading"
				>
					<h2 id="signature-heading" class="text-base font-semibold">立聲明書人（簽名）</h2>

					<SignatureField bind:signatureDataUrl />

					<label class="flex w-full max-w-sm flex-col items-end gap-2 sm:flex-row sm:items-center">
						<span class="shrink-0">日期（西元）</span>
						<input
							type="date"
							bind:value={declarationDate}
							class="input w-full sm:w-auto"
							required
						/>
					</label>
				</section>

				<div class="flex flex-col gap-3 sm:flex-row sm:justify-end">
					<button type="button" class="btn preset-tonal" onclick={handleReset}>清除重填</button>
					<button type="submit" class="btn preset-filled" disabled={!isValid}>提交聲明書</button>
				</div>
			</div>
		</form>
	{/if}
</div>
