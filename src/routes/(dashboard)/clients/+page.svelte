<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Search from '$lib/components/Search.svelte';
	import ClientRow from './ClientRow.svelte';
	import ClientRowHeader from './ClientRowHeader.svelte';
	import { clients, loadClients } from '$lib/stores/ClientStore';
	import { onMount } from 'svelte';
	import BlankState from './BlankState.svelte';
	import SlidePanel from '$lib/components/SlidePanel.svelte';
	import ClientForm from './ClientForm.svelte';

	let isClientFormShowing = false;

	const closePanel = () => {
		isClientFormShowing = false;
	};

	onMount(() => {
		loadClients();
	});
</script>

<svelte:head>
	<title>Clients | The Dollar Holler</title>
</svelte:head>

<div
	class="md:item-center mb-7 flex flex-col-reverse items-start justify-between gap-y-6 md:flex-row md:gap-y-4 lg:mb-16"
>
	<!-- Search Field -->
	{#if $clients.length > 0}
		<Search />
	{:else}
		<div />
	{/if}

	<!-- New invoice button -->
	<Button
		label="+ Client"
		onClick={() => {
			isClientFormShowing = true;
		}}
	/>
</div>

<!-- Clients -->
<div>
	{#if $clients === null}
		Loading...
	{:else if $clients.length <= 0}
		<BlankState />
	{:else}
		<!-- client header row-->
		<ClientRowHeader />

		<!-- client rows-->
		<div class="flex flex-col-reverse">
			{#each $clients as client}
				<ClientRow {client} />
			{/each}
		</div>
	{/if}
</div>

{#if isClientFormShowing}
	<SlidePanel on:closePanel={closePanel}>
		<ClientForm {closePanel} />
	</SlidePanel>
{/if}
