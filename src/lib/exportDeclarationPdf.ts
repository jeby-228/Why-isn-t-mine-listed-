import { browser } from '$app/environment';

export interface DeclarationPdfData {
	name: string;
	department: string;
	declarationItems: readonly string[];
	date: string;
	signatureDataUrl: string;
}

export interface DeclarationPdfResult {
	blob: Blob;
	filename: string;
}

function formatDeclarationDate(date: string) {
	const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
	if (!match) return date;

	const [, year, month, day] = match;
	return `西元 ${year} 年 ${Number(month)} 月 ${Number(day)} 日`;
}

function escapeHtml(value: string) {
	return value
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&#39;');
}

function buildPrintableElement(data: DeclarationPdfData) {
	const container = document.createElement('div');
	container.style.cssText = [
		'position: fixed',
		'inset: 0 auto auto 0',
		'width: 794px',
		'padding: 48px 56px',
		'background: #ffffff',
		'color: #111111',
		'font-family: "Noto Sans TC", "PingFang TC", "Microsoft JhengHei", sans-serif',
		'font-size: 14px',
		'line-height: 1.7',
		'box-sizing: border-box',
		'opacity: 0',
		'pointer-events: none',
		'z-index: -1'
	].join(';');

	const itemsHtml = data.declarationItems
		.map(
			(item, index) => `
			<tr>
				<td style="border: 1px solid #333; padding: 10px 12px; width: 48px; vertical-align: top; text-align: center;">${index + 1}</td>
				<td style="border: 1px solid #333; padding: 10px 12px; vertical-align: top;">${escapeHtml(item)}</td>
				<td style="border: 1px solid #333; padding: 10px 12px; width: 56px; vertical-align: top; text-align: center;">✓</td>
			</tr>`
		)
		.join('');

	container.innerHTML = `
		<h1 style="margin: 0 0 8px; text-align: center; font-size: 24px; font-weight: 700;">員工自主聲明書</h1>
		<p style="margin: 0 0 24px; text-align: center; font-size: 15px;">（辦公室日常社交活動參與意願）</p>
		<p style="margin: 0 0 24px;">
			為保障同仁個人自主權，凡公司內部之非公務日常社交活動（如：辦公室訂購飲品、下午茶、團購等），均以「完全自願」為原則。請詳閱以下聲明內容並確認：
		</p>
		<table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
			<tr>
				<th style="border: 1px solid #333; padding: 10px 12px; width: 120px; text-align: left; background: #f5f5f5;">立聲明書人</th>
				<td style="border: 1px solid #333; padding: 10px 12px;">姓名：${escapeHtml(data.name)}</td>
			</tr>
			<tr>
				<th style="border: 1px solid #333; padding: 10px 12px; text-align: left; background: #f5f5f5;">部門 / 職稱</th>
				<td style="border: 1px solid #333; padding: 10px 12px;">${escapeHtml(data.department)}</td>
			</tr>
		</table>
		<table style="width: 100%; border-collapse: collapse; margin-bottom: 32px;">
			<thead>
				<tr>
					<th style="border: 1px solid #333; padding: 10px 12px; width: 48px; background: #f5f5f5;">項目</th>
					<th style="border: 1px solid #333; padding: 10px 12px; background: #f5f5f5;">聲明內容</th>
					<th style="border: 1px solid #333; padding: 10px 12px; width: 56px; background: #f5f5f5;">確認</th>
				</tr>
			</thead>
			<tbody>${itemsHtml}</tbody>
		</table>
		<div style="display: flex; flex-direction: column; align-items: flex-end; gap: 16px;">
			<div style="display: flex; align-items: center; gap: 12px;">
				<span>立聲明書人（簽名）：</span>
				<img src="${data.signatureDataUrl}" alt="簽名" style="height: 64px; max-width: 220px; object-fit: contain;" />
			</div>
			<p style="margin: 0;">日期：${formatDeclarationDate(data.date)}</p>
		</div>
	`;

	return container;
}

async function waitForImages(element: HTMLElement) {
	const images = Array.from(element.querySelectorAll('img'));

	await Promise.all(
		images.map(
			(image) =>
				new Promise<void>((resolve) => {
					if (image.complete && image.naturalWidth > 0) {
						resolve();
						return;
					}

					image.onload = () => resolve();
					image.onerror = () => resolve();
				})
		)
	);
}

async function waitForLayout() {
	await new Promise<void>((resolve) => {
		requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
	});
}

export function downloadPdfBlob(blob: Blob, filename: string) {
	const url = URL.createObjectURL(blob);
	const link = document.createElement('a');
	link.href = url;
	link.download = filename;
	link.rel = 'noopener';
	document.body.appendChild(link);
	link.click();
	link.remove();
	return url;
}

export async function exportDeclarationPdf(
	data: DeclarationPdfData
): Promise<DeclarationPdfResult> {
	if (!browser) {
		throw new Error('PDF 匯出僅能在瀏覽器中使用');
	}

	const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
		import('html2canvas'),
		import('jspdf')
	]);

	const element = buildPrintableElement(data);
	document.body.appendChild(element);

	try {
		await waitForLayout();
		await waitForImages(element);

		const canvas = await html2canvas(element, {
			scale: 2,
			useCORS: true,
			backgroundColor: '#ffffff',
			logging: false
		});

		if (canvas.width === 0 || canvas.height === 0) {
			throw new Error('無法產生 PDF 預覽內容');
		}

		const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
		const pageWidth = pdf.internal.pageSize.getWidth();
		const pageHeight = pdf.internal.pageSize.getHeight();
		const imgWidth = pageWidth;
		const imgHeight = (canvas.height * imgWidth) / canvas.width;
		const imgData = canvas.toDataURL('image/jpeg', 0.95);

		let heightLeft = imgHeight;
		let position = 0;

		pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
		heightLeft -= pageHeight;

		while (heightLeft > 0) {
			position = heightLeft - imgHeight;
			pdf.addPage();
			pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
			heightLeft -= pageHeight;
		}

		const filename = `員工自主聲明書_${data.name}.pdf`;
		const blob = pdf.output('blob');

		return { blob, filename };
	} finally {
		document.body.removeChild(element);
	}
}
