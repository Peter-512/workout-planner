<script lang="ts">
	import {
		Trigger,
		Drawer,
		Content,
		Close,
		Header,
		Title,
		Description
	} from '$lib/components/ui/drawer/index.js';
	import { Button } from '$lib/components/ui/button';
	import { MenuIcon, Goal, CalendarSync, Bell } from '@lucide/svelte';
	import { resolve } from '$app/paths';
	import { notificationsSupported, subscribeAfterPermission } from './notifications.svelte';
	import { page } from '$app/state';
</script>

<Drawer>
	<Trigger>
		<MenuIcon class="fixed top-4 left-4 text-primary" />
	</Trigger>
	<Content>
		<Header>
			<Title>Quick Actions</Title>
			<Description
				>Plan faster: enable reminders, set weekly goals, and sync workouts to your calendar.</Description
			>
		</Header>

		<div class="container my-4 flex flex-col justify-center gap-2">
			{#if notificationsSupported && Notification.permission !== 'granted'}
				<Close>
					{#snippet child({ props })}
						<Button
							{...props}
							variant="link"
							class="text-lg text-accent-foreground"
							onclick={() => {
								if (!notificationsSupported) {
									return;
								}
								Notification.requestPermission().then((permission) => {
									if (permission === 'granted') {
										subscribeAfterPermission();
									}
								});
							}}
						>
							<Bell class="text-primary size-6" />
							Enable Notification
						</Button>
					{/snippet}
				</Close>
			{/if}
			<Close>
				{#snippet child({ props })}
					<Button
						{...props}
						class="text-lg text-accent-foreground"
						variant="link"
						href={resolve('/goal-setting')}
					>
						<Goal class="text-primary size-6" />
						Set your weekly goals
					</Button>
				{/snippet}
			</Close>
			<Close>
				{#snippet child({ props })}
					<Button
						{...props}
						class="text-lg text-accent-foreground"
						variant="link"
						href={`webcal://${page.url.host}/calendar.ics`}
					>
						<CalendarSync class="text-primary size-6" />
						Subscribe to Calendar
					</Button>
				{/snippet}
			</Close>
		</div>
	</Content>
</Drawer>
