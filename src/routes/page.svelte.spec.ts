import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Page from './+page.svelte';

describe('/+page.svelte', () => {
	it('should render declaration form title', async () => {
		render(Page);

		const title = page.getByRole('heading', { name: '員工自主聲明書' });
		await expect.element(title).toBeInTheDocument();

		const submitButton = page.getByRole('button', { name: '提交聲明書' });
		await expect.element(submitButton).toBeInTheDocument();
	});
});
