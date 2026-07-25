// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	interface Env {
		PUBLIC_GITHUB_REPO?: string;
	}

	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		interface Platform {
			env: Env;
			cf?: IncomingRequestCfProperties;
			ctx?: ExecutionContext;
			caches?: CacheStorage;
		}
	}
}

export {};
