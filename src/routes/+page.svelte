<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import {
		CarouselItem,
		Carousel,
		CarouselContent,
		CarouselButtons
	} from '$lib/components/ui/carousel';
	import { Button } from '$lib/components/ui/button';
	import { Origami, PartyPopper } from '@lucide/svelte';
	import { confetti } from '@neoconfetti/svelte';

	import {
		completeActivity,
		getThisWeeksCompletedActivitiesCount,
		getTodaysActivities
	} from '$lib/activities.remote';
	import { formatDuration, stars, thumbnailUrl } from '$lib/utils';
	import Drawer from './Drawer.svelte';
	import { PersistedState } from 'runed';
	import { Slider } from '$lib/components/ui/slider';

	const activities = $derived(await getTodaysActivities());
	let confettiContainer = $state<HTMLDivElement>();
	const weeklyGoal = new PersistedState('weeklyGoal', 3);
	const thisWeeksCompletedActivities = $derived(await getThisWeeksCompletedActivitiesCount());
</script>

<div class="absolute top-10" bind:this={confettiContainer}></div>
<Drawer />
<Button href="workouts" class="fixed top-4 right-4" variant="secondary">Workouts</Button>

<Slider
	class="max-w-11/12 pointer-events-none"
	type="multiple"
	min={0}
	max={7}
	goal={weeklyGoal.current}
	step={1}
	value={[weeklyGoal.current, thisWeeksCompletedActivities]}
/>

<Carousel orientation="vertical">
	<CarouselContent class="max-h-[500px]">
		{#each activities as activity (activity.id)}
			<CarouselItem class="mx-auto">
				{#if activity?.workout && !activity.completed}
					<div class="fade-out-0 flex items-center h-[500px]">
						<Card.Root>
							<Card.Content class="max-w-sm">
								<div class="px-6">
									<div class="flex items-start gap-3">
										<div class="flex-1">
											<div class="text-sm">Today’s activity</div>
											<h2 class="text-base font-semibold">{activity.workout.title}</h2>
											<div class="mt-1 flex items-center gap-2 text-xs">
												<span class="font-medium text-yellow-400"
													>{stars(activity.workout.intensity)}</span
												>
												<span aria-hidden="true">•</span>
												<span>{formatDuration(activity.workout.duration)}</span>
												{#if activity.workout.type}
													<span aria-hidden="true">•</span>
													<span class="capitalize text-primary">{activity.workout.type}</span>
												{/if}
											</div>
										</div>
									</div>
									<img
										src={thumbnailUrl(activity.workout.videoId)}
										alt="Workout thumbnail"
										class="rounded object-cover mt-2"
										loading="lazy"
									/>
									<div class="mt-3">
										<Button
											target="_blank"
											href={activity.workout.url}
											variant="secondary"
											class="w-full"
										>
											Start workout
										</Button>
										<Button
											onclick={async () => {
												await completeActivity({ id: activity.id, goal: weeklyGoal.current });
												if (confettiContainer) {
													confetti(confettiContainer, {});
												}
											}}
											class="w-full mt-2"
										>
											Complete workout!
										</Button>
									</div>
								</div>
							</Card.Content>
						</Card.Root>
					</div>
				{:else if activity?.completed}
					<div class="fade-in flex items-center h-[500px]">
						<Card.Root>
							<Card.Content class="max-w-sm px-6">
								<div class="text-center text-sm">You completed your activity for today! 🎉</div>
								<PartyPopper size="100" class="m-auto mt-4" />
							</Card.Content>
						</Card.Root>
					</div>
				{/if}
			</CarouselItem>
		{:else}
			<CarouselItem class="mx-auto">
				<div class="flex items-center h-[500px]">
					<Card.Root>
						<Card.Content class="w-full max-w-sm shadow-lg px-6">
							<div class="text-center text-sm">It's a rest day today 😌</div>
							<Origami size="100" class="m-auto mt-4" />
						</Card.Content>
					</Card.Root>
				</div>
			</CarouselItem>
		{/each}
	</CarouselContent>
	{#if activities && activities.length > 1}
		<CarouselButtons />
	{/if}
</Carousel>

<Button href="add-workout" class="fixed left-4 bottom-4 w-1/3 max-w-xs" variant="outline"
	>Add workout</Button
>
<Button href="plan-activities" class="fixed right-4 bottom-4 w-1/3 max-w-xs" variant="default"
	>Plan activities</Button
>
