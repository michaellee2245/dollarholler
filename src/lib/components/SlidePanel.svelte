<script lang="ts">
	import { fly } from 'svelte/transition';
	import { createEventDispatcher } from 'svelte';
	import Arrow from './Icon/Arrow.svelte';
	import Overlay from './Overlay.svelte';
	import Portal from './Portal.svelte';
	import { clickOutside } from '$lib/actions/ClickOutside';

	const dispatch = createEventDispatcher();
</script>

<svelte:window
	on:keydown={(event) => {
		if (event.key === 'Escape') {
			dispatch('closePanel');
		}
	}}
/>

<Portal>
	<Overlay />
	<div
		class="fixed right-0 top-0 z-slidePanel h-screen w-full overflow-scroll bg-white px-5 pt-16 shadow-slidePanel lg:w-3/4 lg:py-20 lg:px-32"
		transition:fly={{ x: 1000, duration: 500 }}
		use:clickOutside={() => {
			dispatch('closePanel');
		}}
	>
		<button
			class="absolute top-5 left-7 text-pastelPurple hover:text-daisyBush"
			on:click={() => {
				dispatch('closePanel');
			}}><Arrow /></button
		>
		<slot />
	</div>
</Portal>
