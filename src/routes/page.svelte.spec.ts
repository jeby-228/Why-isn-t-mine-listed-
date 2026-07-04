import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Page from './+page.svelte';

describe('/+page.svelte', () => {
	it('should render steps component', async () => {
		render(Page);

		const firstStep = page.getByRole('tab', { name: 'First' });
		await expect.element(firstStep).toBeInTheDocument();

		const nextButton = page.getByRole('button', { name: 'Next' });
		await expect.element(nextButton).toBeInTheDocument();
	});
});
