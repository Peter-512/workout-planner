<script>
	import { Spinner } from '$lib/components/ui/spinner/index';
</script>

{#if $effect.pending()}
	<div class="fixed inset-0 flex items-center justify-center backdrop-blur-sm gap-2 z-50">
		<Spinner class="text-primary size-6" />
		<div class="animate-pulse font-medium">Loading…</div>
	</div>
{/if}
