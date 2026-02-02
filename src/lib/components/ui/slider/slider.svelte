<script lang="ts">
	import { Slider as SliderPrimitive } from 'bits-ui';
	import { cn, type WithoutChildrenOrChild } from '$lib/utils.js';
	import { Goal } from '@lucide/svelte';

	type SliderProps = WithoutChildrenOrChild<SliderPrimitive.RootProps> & {
		goal?: number;
		showTicks?: boolean;
		showTickLabels?: boolean;
	};

	let {
		ref = $bindable(null),
		value = $bindable(),
		orientation = 'horizontal',
		goal,
		showTicks = true,
		showTickLabels = true,
		class: className,
		...restProps
	}: SliderProps = $props();
</script>

<!--
Discriminated Unions + Destructing (required for bindable) do not
get along, so we shut typescript up by casting `value` to `never`.
-->
<SliderPrimitive.Root
	bind:ref
	bind:value={value as never}
	data-slot="slider"
	{orientation}
	class={cn(
		'relative flex w-full touch-none items-center select-none data-disabled:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col',
		className
	)}
	{...restProps}
>
	{#snippet children({ thumbs, tickItems })}
		<span
			data-orientation={orientation}
			data-slot="slider-track"
			class={cn(
				'bg-muted relative grow overflow-hidden rounded-full data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5'
			)}
		>
			<SliderPrimitive.Range
				data-slot="slider-range"
				class={cn(
					'bg-primary absolute data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full'
				)}
			/>
		</span>
		{#each thumbs as thumb (thumb)}
			<SliderPrimitive.Thumb
				data-slot="slider-thumb"
				index={thumb}
				class="border-primary ring-ring/50 block size-4 shrink-0 rounded-full border bg-white shadow-sm transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50"
			/>
		{/each}
		{#if showTicks}
			{#each tickItems as { index, value } (index)}
				{@const tickLabel = `${value} ${orientation === 'vertical' ? (value === 1 ? 'day' : 'days') : 'd'}`}
				{@const isGoalTick = goal !== undefined && value === goal}
				<SliderPrimitive.Tick
					{index}
					class={cn(
						'dark:bg-background bg-background z-1 data-[orientation=horizontal]:h-2 data-[orientation=horizontal]:w-px data-[orientation=vertical]:h-px data-[orientation=vertical]:w-4'
					)}
				/>
				{#if showTickLabels}
					<SliderPrimitive.TickLabel
						{index}
						class={cn(
							'text-muted-foreground data-selected:text-foreground data-[orientation=vertical]:mr-5 data-[orientation=horizontal]:mb-5 text-sm font-medium leading-none whitespace-nowrap'
						)}
					>
						{#if isGoalTick}
							<Goal class="size-6 text-primary" />
						{:else}
							{tickLabel}
						{/if}
					</SliderPrimitive.TickLabel>
				{/if}
			{/each}
		{/if}
	{/snippet}
</SliderPrimitive.Root>
