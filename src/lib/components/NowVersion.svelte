<script lang="ts">
	// @ts-expect-error injected at build time
	const version = __GIT_VERSION__;
	// @ts-expect-error injected at build time
	const last_commit_time = __GIT_LAST_COMMIT_TIME__;
</script>

<span class="text-xs text-surface-400">
	{version} (Last commit: {last_commit_time})
</span>
