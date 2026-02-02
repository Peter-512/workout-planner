<script lang="ts">
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import SlidersHorizontalIcon from '@lucide/svelte/icons/sliders-horizontal';
	import { type DateValue, DateFormatter, getLocalTimeZone } from '@internationalized/date';
	import { cn } from '$lib/utils.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Calendar } from '$lib/components/ui/calendar/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Empty from '$lib/components/ui/empty';
	import { Slider } from '$lib/components/ui/slider';
	import { getWorkouts } from '$lib/remote/workouts.remote';
	import Workout from '$lib/components/Workout.svelte';
	import { createActivities } from '$lib/remote/activities.remote';
	import LoadingScreen from '$lib/components/LoadingScreen.svelte';
	import type { Workout as WorkoutType } from '$lib/types';

	const df = new DateFormatter('en-US', {
		dateStyle: 'long'
	});

	const workoutTypes = [
		'cardio',
		'strength',
		'stretching',
		'dance party',
		'yoga',
		'mobility'
	] as const;

	let date = $state<DateValue>();
	let dateOpen = $state(true);
	let filtersOpen = $state(false);

	let ratingRange = $state<[number, number]>([1, 5]);
	let intensityRange = $state<[number, number]>([1, 5]);
	let typeFilter = $state<(typeof workoutTypes)[number] | 'all'>('all');
	let durationSort = $state<'none' | 'asc' | 'desc'>('none');

	let selectedIds = $state<Array<number>>([]);

	const normalizeRange = (range: [number, number]) =>
		range[0] <= range[1] ? range : [range[1], range[0]];

	const ratingBounds = $derived.by(() => normalizeRange(ratingRange));
	const intensityBounds = $derived.by(() => normalizeRange(intensityRange));

	const applyFilters = (workouts: WorkoutType[]) => {
		const [ratingMin, ratingMax] = normalizeRange(ratingRange);
		const [intensityMin, intensityMax] = normalizeRange(intensityRange);

		let filtered = workouts.filter((workout) => {
			const ratingOk =
				workout.rating != null && workout.rating >= ratingMin && workout.rating <= ratingMax;
			const intensityOk =
				workout.intensity != null &&
				workout.intensity >= intensityMin &&
				workout.intensity <= intensityMax;
			const typeOk = typeFilter === 'all' ? true : workout.type === typeFilter;
			return ratingOk && intensityOk && typeOk;
		});

		if (durationSort !== 'none') {
			filtered = [...filtered].sort((a, b) =>
				durationSort === 'asc' ? a.duration - b.duration : b.duration - a.duration
			);
		}

		return filtered;
	};
</script>

<LoadingScreen />

<div class="mt-12 flex items-center justify-center gap-2">
	<Popover.Root bind:open={dateOpen}>
		<Popover.Trigger>
			{#snippet child({ props })}
				<Button onclick={() => (dateOpen = !dateOpen)} variant="outline" {...props}>
					<CalendarIcon class="me-2 size-4" />
					{date ? df.format(date.toDate(getLocalTimeZone())) : 'Select a date'}
				</Button>
			{/snippet}
		</Popover.Trigger>
		<Popover.Content class="w-auto p-0">
			<Calendar
				weekStartsOn={1}
				onValueChange={() => (dateOpen = false)}
				bind:value={date}
				type="single"
				initialFocus
				captionLayout="dropdown"
			/>
		</Popover.Content>
	</Popover.Root>

	<Dialog.Root bind:open={filtersOpen}>
		<Dialog.Trigger>
			{#snippet child({ props })}
				<Button variant="outline" {...props}>
					<SlidersHorizontalIcon class="me-2 size-4" />
					Filters
				</Button>
			{/snippet}
		</Dialog.Trigger>
		<Dialog.Content class="sm:max-w-md">
			<Dialog.Header>
				<Dialog.Title>Filter & sort</Dialog.Title>
				<Dialog.Description>Adjust the list before planning your day.</Dialog.Description>
			</Dialog.Header>

			<div class="mt-4 flex flex-col gap-5">
				<div class="flex flex-col gap-2">
					<div class="flex items-center justify-between">
						<span class="text-sm font-medium">Rating</span>
						<span class="text-xs text-muted-foreground">{ratingBounds[0]}–{ratingBounds[1]}</span>
					</div>
					<Slider
						min={1}
						max={5}
						step={1}
						type="multiple"
						bind:value={ratingRange}
						showTicks={false}
					/>
					<div class="flex items-center justify-between text-xs text-muted-foreground">
						<span>1</span>
						<span>5</span>
					</div>
				</div>

				<div class="flex flex-col gap-2">
					<div class="flex items-center justify-between">
						<span class="text-sm font-medium">Intensity</span>
						<span class="text-xs text-muted-foreground"
							>{intensityBounds[0]}–{intensityBounds[1]}</span
						>
					</div>
					<Slider
						min={1}
						max={5}
						step={1}
						type="multiple"
						bind:value={intensityRange}
						showTicks={false}
					/>
					<div class="flex items-center justify-between text-xs text-muted-foreground">
						<span>1</span>
						<span>5</span>
					</div>
				</div>

				<div class="flex flex-col gap-2">
					<label class="text-sm font-medium" for="workout-type-filter">Workout type</label>
					<select
						id="workout-type-filter"
						class="border-input bg-background shadow-xs focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] flex h-9 w-full rounded-md border px-3 py-1 text-sm outline-none"
						bind:value={typeFilter}
					>
						<option value="all">All types</option>
						{#each workoutTypes as workoutType (workoutType)}
							<option value={workoutType} class="capitalize">
								{workoutType}
							</option>
						{/each}
					</select>
				</div>

				<div class="flex flex-col gap-2">
					<label class="text-sm font-medium" for="duration-sort">Sort by duration</label>
					<select
						id="duration-sort"
						class="border-input bg-background shadow-xs focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] flex h-9 w-full rounded-md border px-3 py-1 text-sm outline-none"
						bind:value={durationSort}
					>
						<option value="none">Default order</option>
						<option value="asc">Shortest first</option>
						<option value="desc">Longest first</option>
					</select>
				</div>
			</div>

			<Dialog.Footer class="mt-6">
				<Button
					variant="ghost"
					onclick={() => {
						ratingRange = [1, 5];
						intensityRange = [1, 5];
						typeFilter = 'all';
						durationSort = 'none';
					}}
				>
					Reset
				</Button>
				<Dialog.Close>
					{#snippet child({ props })}
						<Button {...props}>Done</Button>
					{/snippet}
				</Dialog.Close>
			</Dialog.Footer>
		</Dialog.Content>
	</Dialog.Root>
</div>

<div class="mt-4 max-w-md mx-auto flex flex-col gap-2">
	{#await getWorkouts() then workouts}
		{@const filtered = applyFilters(workouts)}

		{#if workouts.length === 0}
			<Empty.Root class="mx-4">
				<Empty.Media variant="icon">
					<CalendarIcon class="size-5" />
				</Empty.Media>
				<Empty.Title>No workouts available</Empty.Title>
				<Empty.Description
					>Add a few workouts first, then come back to plan your day.</Empty.Description
				>
			</Empty.Root>
		{:else if filtered.length === 0}
			<Empty.Root class="mx-4">
				<Empty.Media variant="icon">
					<SlidersHorizontalIcon class="size-5" />
				</Empty.Media>
				<Empty.Title>No workouts match these filters</Empty.Title>
				<Empty.Description>Try widening the rating or intensity range.</Empty.Description>
			</Empty.Root>
		{:else}
			{#each filtered as { id, ...workout }, i (id)}
				{@const idx = selectedIds.indexOf(id)}
				{@const isSelected = idx !== -1}
				<div class={cn('relative', i === filtered.length - 1 ? 'mb-24' : '')}>
					<Workout
						workoutId={id}
						onclick={() => {
							if (idx === -1) {
								selectedIds.push(id);
							} else {
								selectedIds.splice(idx, 1);
							}
						}}
						links={false}
						class={cn(
							'cursor-pointer rounded border p-3 text-sm mx-4',
							isSelected ? 'border-primary' : 'border-gray-200'
						)}
						{...workout}
					/>

					{#if isSelected}
						<div
							class="absolute -top-2.75 right-1.25 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground shadow"
						>
							{idx + 1}
						</div>
					{/if}
				</div>
			{/each}
		{/if}
	{/await}
</div>

<form
	{...createActivities}
	class="fixed inset-x-0 bottom-0 z-20 backdrop-blur px-4 pt-2 pb-[calc(env(safe-area-inset-bottom)+0.75rem)]"
>
	<input type="hidden" name="date" value={date ? date.toString() : ''} />
	{#each selectedIds as id (id)}
		<input type="hidden" name="ids[]" value={`${id}`} />
	{/each}
	<Button type="submit" class="w-full">Plan workouts</Button>
</form>
