<script lang="ts">
	import { PersistedState } from 'runed';
	import { Slider } from '$lib/components/ui/slider';
	import { Button } from '$lib/components/ui/button';
	import { resolve } from '$app/paths';
	import LoadingScreen from '$lib/components/LoadingScreen.svelte';

	const weeklyGoal = new PersistedState('weeklyGoal', 3);
</script>

<LoadingScreen />

<div class="flex items-center justify-between flex-col gap-4">
	<div class="text-center">
		<h1 class="text-lg font-semibold">Weekly workout goal</h1>
		<span class="text-sm text-muted-foreground">{weeklyGoal.current} / week</span>
	</div>
	<Slider
		min={1}
		max={7}
		step={1}
		orientation="vertical"
		bind:value={weeklyGoal.current}
		type="single"
	/>
	<Button class="mx-auto" href={resolve('/')}>Save Goal</Button>
</div>
