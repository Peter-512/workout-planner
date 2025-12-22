<script lang="ts">
	import { getEmblaContext } from '$lib/components/ui/carousel/context';
	import { CarouselNext, CarouselPrevious } from '$lib/components/ui/carousel/index';

	const emblaContext = getEmblaContext('<Carousel.Content/>');
</script>

<CarouselPrevious variant={emblaContext.canScrollPrev ? 'default' : 'outline'} />
<CarouselNext variant={emblaContext.canScrollNext ? 'default' : 'outline'} />
