<script lang="ts">
	import { fly } from 'svelte/transition';
	import { afterNavigate, goto } from '$app/navigation';
	import Arrow from '$lib/components/Icon/Arrow.svelte';

	let previousPage: string | undefined = undefined;

	afterNavigate((navigation) => {
		previousPage = navigation?.from?.url?.pathname;
	});
</script>

<svelte:window
	on:keydown={(event) => {
		if (event.key === 'Escape') {
			goto(previousPage || './invoices');
		}
	}}
/>

<div
	class="h-full min-h-screen w-full bg-whisper pt-16 pb-32 print:bg-transparent print:pt-0 print:pb-0 lg:pt-12"
>
	<main class="mx-auto min-h-screen max-w-screen-lg" transition:fly={{ y: 500, duration: 250 }}>
		<a
			href={previousPage ? previousPage : '/invoices'}
			class="fixed top-7 left-7 text-pastelPurple print:hidden"><Arrow /></a
		>
		<slot><!-- optional fallback--></slot>
	</main>
</div>
