import { env } from '$env/dynamic/public';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ platform }) => {
	return {
		githubRepo: platform?.env?.PUBLIC_GITHUB_REPO ?? env.PUBLIC_GITHUB_REPO ?? ''
	};
};
