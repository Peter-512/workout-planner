<script lang="ts">
	import { Card } from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
</script>

<Card class="w-full max-w-sm mx-auto shadow-lg">
	<div class="p-6 text-center">
		<h1 class="text-2xl font-bold mb-2">Welcome to Workout Planner</h1>
		<p class="mb-4">Plan your workouts and reach your goals!</p>
	</div>
</Card>

<Button href="add-workout" class="fixed left-4 bottom-4 w-1/3 max-w-xs" variant="outline">Add workout</Button>
<Button href="plan-activities" class="fixed right-4 bottom-4 w-1/3 max-w-xs" variant="default">Plan activities</Button>
