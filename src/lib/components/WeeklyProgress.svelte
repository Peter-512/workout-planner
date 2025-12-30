<script lang="ts">
	import type { PersistedState } from 'runed';
	import { getThisWeeksCompletedActivitiesCount } from '$lib/remote/activities.remote';
	import { Slider } from '$lib/components/ui/slider';

	type Props = {
		weeklyGoal: PersistedState<number>;
	};

	const { weeklyGoal }: Props = $props();
</script>

<svelte:boundary>
	{#snippet pending()}
		<div class="h-24 w-11/12 max-w-md animate-pulse rounded-lg"></div>
	{/snippet}
	<Slider
		class="max-w-11/12 pointer-events-none"
		type="multiple"
		min={0}
		max={7}
		goal={weeklyGoal.current}
		step={1}
		value={[weeklyGoal.current, await getThisWeeksCompletedActivitiesCount()]}
	/>
</svelte:boundary>
