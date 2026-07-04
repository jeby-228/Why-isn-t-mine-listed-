import { browser } from '$app/environment';
import { env } from '$env/dynamic/public';

declare global {
	interface Window {
		gtag?: (command: string, ...args: unknown[]) => void;
	}
}

const measurementId = browser ? env.PUBLIC_GA4_MEASUREMENT_ID : undefined;

export function trackPageView(url: string) {
	if (!browser || !window.gtag || !measurementId) return;

	window.gtag('config', measurementId, {
		page_path: url
	});
}
