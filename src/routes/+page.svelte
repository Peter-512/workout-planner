<script lang="ts">
	import { Card } from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Origami, PartyPopper } from '@lucide/svelte';
	import { page } from '$app/state';
	import { confetti } from '@neoconfetti/svelte';
	import { fade, fly } from 'svelte/transition';

	import { completeActivity, getTodaysActivity } from '$lib/activities.remote';
	import { formatDuration, stars, thumbnailUrl } from '$lib/utils';

	const activity = $derived(await getTodaysActivity());
	let confettiContainer = $state<HTMLDivElement>();
</script>

<div class="absolute top-10" bind:this={confettiContainer}></div>
<Button href={`webcal://${page.url.host}/calendar.ics`} class="fixed top-4 left-4" variant="outline">Subscribe</Button>
<Button href="workouts" class="fixed top-4 right-4" variant="secondary">Workouts</Button>


<div in:fade={{ duration: 200 }}>
	{#if activity?.workout && !activity.completed}
		<div class="fade-out-0" in:fly={{ y: 40, duration: 300 }} out:fly={{ y: -40, duration: 200 }}>
			<Card class="w-full max-w-sm shadow-lg">
				<div class="px-6">
					<div class="flex items-start gap-3">
						<div class="flex-1">
							<div class="text-sm">Today’s activity</div>
							<h2 class="text-base font-semibold">{activity.workout.title}</h2>
							<div class="mt-1 flex items-center gap-2 text-xs ">
								<span class="font-medium text-yellow-400">{stars(activity.workout.intensity)}</span>
								<span aria-hidden="true">•</span>
								<span>{formatDuration(activity.workout.duration)}</span>
								{#if activity.workout.type}
									<span aria-hidden="true">•</span>
									<span class="capitalize text-primary">{activity.workout.type}</span>
								{/if}
							</div>
						</div>
					</div>
					<img src={thumbnailUrl(activity.workout.videoId)} alt="Workout thumbnail" class="rounded object-cover mt-2" loading="lazy" in:fade out:fade />
					<div class="mt-3">
						<Button target="_blank" href={activity.workout.url} variant="secondary" class="w-full">
							Start workout
						</Button>
						<Button onclick={async () => {
							await completeActivity();
							if (confettiContainer) {
								// FIXME: confetti container jumps around as transitions are playing
								// confetti(confettiContainer)
							}
						}} class="w-full mt-2">
							Complete workout!
						</Button>
					</div>
				</div>
			</Card>
		</div>
	{:else if activity?.completed}
		<div class="fade-in" in:fly={{ y: 40, duration: 200, delay: 200 }} out:fly={{ y: -40, duration: 200 }}>
			<Card class="w-full max-w-sm shadow-lg px-6">
				<div class="text-center text-sm">You completed your activity for today! 🎉</div>
				<PartyPopper size="100" class="m-auto mt-4" />
			</Card>
		</div>
	{:else}
		<div in:fly={{ y: 40, duration: 200 }}>
			<Card class="w-full max-w-sm shadow-lg px-6">
				<div class="text-center text-sm">It's a rest day today 😌</div>
				<Origami size="100" class="m-auto mt-4" />
			</Card>
		</div>
	{/if}
</div>

<Button href="add-workout" class="fixed left-4 bottom-4 w-1/3 max-w-xs" variant="outline">Add workout</Button>
<Button href="plan-activities" class="fixed right-4 bottom-4 w-1/3 max-w-xs" variant="default">Plan activities</Button>
