<script lang="ts">
	import CalendarIcon from "@lucide/svelte/icons/calendar";
	import {
		type DateValue,
		DateFormatter,
		getLocalTimeZone, today
	} from '@internationalized/date';
	import { cn } from "$lib/utils.js";
	import { Button } from "$lib/components/ui/button/index.js";
	import { Calendar } from "$lib/components/ui/calendar/index.js";
	import * as Popover from "$lib/components/ui/popover/index.js";
	import { getWorkouts } from '$lib/workouts.remote';
	import Workout from "$lib/Workout.svelte";
	import { createActivities } from '$lib/activities.remote';

	const df = new DateFormatter("en-US", {
		dateStyle: "long",
	});

	let date = $state<DateValue>();
	let open = $state(false);

	const workouts = await getWorkouts()

	let selectedIds = $state<Array<number>>([]);
</script>

<Popover.Root bind:open>
	<Popover.Trigger class="mt-2">
		{#snippet child({ props })}
			<Button
				onclick={() => open = !open}
				variant="outline"
				{...props}
			>
				<CalendarIcon class="me-2 size-4" />
				{date ? df.format(date.toDate(getLocalTimeZone())) : "Select a date"}
			</Button>
		{/snippet}
	</Popover.Trigger>
	<Popover.Content class="w-auto p-0">
		<Calendar onValueChange={() => open = false} minValue={today(getLocalTimeZone())} bind:value={date} type="single" initialFocus captionLayout="dropdown" />
	</Popover.Content>
</Popover.Root>

<div class="mt-4 max-w-md mx-auto flex flex-col gap-2">
	{#each workouts as { url, ...w }, i}
		{@const idx = selectedIds.indexOf(w.id)}
		{@const isSelected = idx !== -1}
		<div class={cn("relative", i === workouts.length - 1 ? "mb-24" : "")}>
			<Workout
				onclick={() => {
					if (idx === -1) {
						selectedIds = [...selectedIds, w.id]
					}
					else {
						selectedIds = selectedIds.filter((id) => id !== w.id)
					}
				}}
				class={cn(
					"cursor-pointer rounded border p-3 text-sm mx-4",
					isSelected ? "border-blue-500" : "border-gray-200"
				)}
				{...w}
			/>

			{#if isSelected}
				<div class="absolute -top-2.75 right-1.25 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white shadow">
					{idx + 1}
				</div>
			{/if}
		</div>
	{:else}
		<div class="rounded border border-gray-200  p-4 text-center text-sm">No workouts available</div>
	{/each}
</div>

<form {...createActivities} class="fixed inset-x-0 bottom-0 z-20 backdrop-blur px-4 pt-2 pb-[calc(env(safe-area-inset-bottom)+0.75rem)]">
	<input type="hidden" name="date" value={date ? date.toDate(getLocalTimeZone()).toISOString() : ''} />
	{#each selectedIds as id}
		<input type="hidden" name="ids[]" value={`${id}`} />
	{/each}
	<Button type="submit" class="w-full">Plan workouts</Button>
</form>
