import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';
import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { execSync } from 'child_process';

function getGitInfo() {
	try {
		const branch = execSync('git branch --show-current').toString().trim();
		const version = execSync('git describe --tags --always').toString().trim();
		const lastCommitTime = execSync('git log -1 --format=%ci').toString().trim();
		const isDirty = execSync('git status --porcelain').toString().trim().length > 0;
		const commitHash = execSync('git rev-parse HEAD').toString().trim();
		return { branch, version, lastCommitTime, isDirty, commitHash };
	} catch {
		return {
			branch: 'unknown',
			version: 'unknown',
			lastCommitTime: 'unknown',
			isDirty: false,
			commitHash: 'unknown'
		};
	}
}

const gitInfo = getGitInfo();

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	define: {
		__GIT_BRANCH__: JSON.stringify(gitInfo.branch),
		__GIT_VERSION__: JSON.stringify(gitInfo.version),
		__GIT_LAST_COMMIT_TIME__: JSON.stringify(gitInfo.lastCommitTime),
		__IS_DIRTY__: JSON.stringify(gitInfo.isDirty),
		__COMMIT_HASH__: JSON.stringify(gitInfo.commitHash)
	},
	optimizeDeps: {
		include: ['@skeletonlabs/skeleton-svelte', '@lucide/svelte']
	},
	test: {
		expect: { requireAssertions: true },
		projects: [
			{
				extends: './vite.config.ts',
				test: {
					name: 'client',
					browser: {
						enabled: true,
						provider: playwright(),
						instances: [{ browser: 'chromium', headless: true }]
					},
					include: ['src/**/*.svelte.{test,spec}.{js,ts}'],
					exclude: ['src/lib/server/**']
				}
			},

			{
				extends: './vite.config.ts',
				test: {
					name: 'server',
					environment: 'node',
					include: ['src/**/*.{test,spec}.{js,ts}'],
					exclude: ['src/**/*.svelte.{test,spec}.{js,ts}']
				}
			}
		]
	}
});
