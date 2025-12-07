<script lang="ts">
	import { getWorkouts } from '$lib/workouts.remote';
	import { Card } from '$lib/components/ui/card';

	const workouts = await getWorkouts();

	function formatDuration(seconds: number): string {
		const m = Math.floor(seconds / 60);
		const s = seconds % 60;
		return m > 0 ? `${m}m ${s}s` : `${s}s`;
	}

	function stars(n: number): string {
		return '★★★★★'.slice(0, Math.max(0, Math.min(5, n)));
	}

	function thumbnailUrl(id: string): string | null {
		return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
	}
</script>

<div class="min-h-screen w-full px-4 py-6">
	<div class="max-w-md mx-auto flex flex-col gap-3">
		{#each workouts as w}
			<Card target="_blank" href={w.url} class="p-4 shadow-sm">
				<div class="flex items-start justify-between gap-3">
					<div class="flex-1">
						<h2 class="text-base font-semibold ">{w.title}</h2>
						<div class="mt-2 flex items-center gap-2 text-xs">
							<span class="font-medium">{stars(w.intensity)}</span>
							<span aria-hidden="true">•</span>
							<span>{formatDuration(w.duration)}</span>
							<span aria-hidden="true">•</span>
							<span class="capitalize">{w.type}</span>
						</div>
					</div>
					<img src={thumbnailUrl(w.videoId)} alt="YouTube thumbnail" class="w-20 h-14 rounded object-cover" loading="lazy" />
				</div>
			</Card>
		{:else}
			<Card class="p-6 text-center text-sm ">No workouts yet</Card>
		{/each}
	</div>
</div>
