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
	import { page } from '$app/state';
	import { confetti } from '@neoconfetti/svelte';

	import { completeActivity, getTodaysActivities } from '$lib/activities.remote';
	import { formatDuration, stars, thumbnailUrl } from '$lib/utils';

	const activities = $derived(await getTodaysActivities());
	let confettiContainer = $state<HTMLDivElement>();
</script>

<div class="absolute top-10" bind:this={confettiContainer}></div>
<Button href={`webcal://${page.url.host}/calendar.ics`} class="fixed top-4 left-4" variant="outline"
	>Subscribe</Button
>
{#if Notification && Notification.permission !== 'granted'}
	<Button
		class="fixed top-4 right-30"
		onclick={() => {
			Notification.requestPermission().then((permission) => {
				if (permission === 'granted') {
					console.log('Notification permission granted.');
				}
				console.log('Notification permission status:', permission);
			});
		}}>Enable Notification</Button
	>
{/if}
<Button href="workouts" class="fixed top-4 right-4" variant="secondary">Workouts</Button>

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
												await completeActivity(activity.id);
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
				<div>
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
