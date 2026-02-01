<script lang="ts">
	import { createWorkout } from '$lib/remote/workouts.remote';
	import { Button } from '$lib/components/ui/button';
	import LoadingScreen from '$lib/components/LoadingScreen.svelte';
</script>

<LoadingScreen />

<form {...createWorkout} class="flex flex-col gap-4 p-4 w-full max-w-md mx-auto">
	<label class="flex flex-col gap-1">
		<span class="text-sm font-medium">Workout URL</span>
		<input
			class="rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
			{...createWorkout.fields.url.as('url')}
			placeholder="https://example.com/workout"
			required
		/>
	</label>
	{#each createWorkout.fields.url.issues() as issue (issue.message)}
		<p class="issue">{issue.message}</p>
	{/each}

	<label class="flex flex-col gap-1">
		<span class="text-sm font-medium">Intensity</span>
		<select
			class="rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
			{...createWorkout.fields.intensity.as('select')}
			required
		>
			<option value="" disabled selected>Select intensity</option>
			<option value="1">1 💧</option>
			<option value="2">2 💧💧</option>
			<option value="3">3 💧💧💧</option>
			<option value="4">4 💧💧💧💧</option>
			<option value="5">5 💧💧💧💧💧</option>
		</select>
	</label>

	{#each createWorkout.fields.intensity.issues() as issue (issue.message)}
		<p class="issue">{issue.message}</p>
	{/each}

	<label class="flex flex-col gap-1">
		<span class="text-sm font-medium">Enjoyment rating</span>
		<select
			class="rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
			{...createWorkout.fields.rating.as('select')}
			required
		>
			<option value="" disabled selected>Select rating</option>
			<option value="1">1 ⭐</option>
			<option value="2">2 ⭐⭐</option>
			<option value="3">3 ⭐⭐⭐</option>
			<option value="4">4 ⭐⭐⭐⭐</option>
			<option value="5">5 ⭐⭐⭐⭐⭐</option>
		</select>
	</label>

	{#each createWorkout.fields.rating.issues() as issue (issue.message)}
		<p class="issue">{issue.message}</p>
	{/each}

	<label class="flex flex-col gap-1">
		<span class="text-sm font-medium">Workout type</span>
		<select
			class="rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
			{...createWorkout.fields.type.as('select')}
			required
		>
			<option value="" disabled selected>Select workout type</option>
			<option value="cardio">Cardio</option>
			<option value="strength">Strength</option>
			<option value="stretching">Stretching</option>
			<option value="dance party">Dance party</option>
			<option value="yoga">Yoga</option>
			<option value="mobility">Mobility</option>
		</select>
	</label>

	{#each createWorkout.fields.type.issues() as issue (issue.message)}
		<p class="issue">{issue.message}</p>
	{/each}

	<Button type="submit" class="w-full">Create workout</Button>
</form>

<style>
	.issue {
		color: #dc2626; /* Tailwind's red-600 */
		font-size: 0.875rem; /* Tailwind's text-sm */
		margin-top: 0.25rem; /* Tailwind's mt-1 */
	}
</style>
