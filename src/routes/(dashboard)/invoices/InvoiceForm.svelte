<script lang="ts">
	import { addClient, clients, loadClients } from '$lib/stores/ClientStore';
	import { slide } from 'svelte/transition';
	import Button from '$lib/components/Button.svelte';
	import Trash from '$lib/components/Icon/Trash.svelte';
	import LineItemRows from './LineItemRows.svelte';
	import { v4 as uuidv4 } from 'uuid';
	import { states } from '$lib/utils/states';
	import { onMount } from 'svelte';
	import { today } from '$lib/utils/dateHelpers';
	import { addInvoice, updateInvoice } from '$lib/stores/InvoiceStore';
	import ConfirmDelete from './ConfirmDelete.svelte';
	import { snackbar } from '$lib/stores/SnackbarStore';

	const blankLineItem = {
		id: uuidv4(),
		description: '',
		quantity: 0,
		amount: 0
	};

	let isNewClient: boolean = false;
	export let invoice: Invoice = {
		client: {} as Client,
		lineItems: [{ ...blankLineItem }] as LineItem[]
	} as Invoice;
	let newClient: Partial<Client> = {};

	export let formState: 'create' | 'edit' = 'create';

	export let closePanel: () => void = () => {};

	let isModalShowing = false;

	const initialDiscount = invoice.discount || 0;

	const AddLineItem = () => {
		invoice.lineItems = [...(invoice.lineItems as []), { ...blankLineItem, id: uuidv4() }];
	};

	const RemoveLineItem = (event: CustomEvent) => {
		invoice.lineItems =
			invoice?.lineItems && invoice.lineItems.filter((item) => item.id !== event.detail);
	};

	const UpdateLineItem = () => {
		invoice.lineItems = invoice.lineItems;
	};

	const handleSubmit = async () => {
		if (isNewClient) {
			invoice.client = newClient as Client;
			const addedClient = await addClient(newClient as Client);
			invoice.client.id = addedClient?.id;
		}

		if (formState === 'create') {
			await addInvoice(invoice);
		} else {
			await updateInvoice(invoice);
		}

		closePanel();
	};

	const updateDiscount = (event: CustomEvent) => {
		invoice.discount = event.detail.discount;
	};

	onMount(() => {
		loadClients();
	});
</script>

<h2 class="mb-7 font-sansSerif text-3xl font-bold text-daisyBush">
	{#if formState === 'create'}Add{:else}Edit{/if} an Invoice
</h2>

<form class="grid grid-cols-6 gap-x-5" on:submit|preventDefault={handleSubmit}>
	<!-- client -->
	<div class="field col-span-6 md:col-span-4 ">
		{#if !isNewClient}
			<label for="client">Client</label>
			<div class=" flex flex-wrap items-end gap-x-2 gap-y-2 sm:flex-nowrap md:gap-x-5">
				<select
					name="client"
					id="client"
					required={!isNewClient}
					bind:value={invoice.client.id}
					on:change={() => {
						const selectedClient = $clients.find((client) => client.id === invoice.client.id);
						invoice.client.name = selectedClient?.name !== undefined ? selectedClient.name : '';
					}}
				>
					<option />
					{#each $clients as client}
						<option value={client.id}>{client.name}</option>
					{/each}
				</select>
				<div class="text-base font-bold leading-[2.25rem] text-monsoon lg:leading-[3.5rem]">or</div>
				<Button
					label="+ Client"
					onClick={() => {
						isNewClient = true;
						invoice.client.name = '';
						invoice.client.email = '';
					}}
					style="outline"
					isAnimated={false}
				/>
			</div>
		{:else}
			<label for="NewClient">New Client</label>
			<div class="flex flex-wrap items-end gap-x-2 gap-y-2 sm:flex-nowrap md:gap-x-5">
				<input type="text" name="NewClient" required={isNewClient} bind:value={newClient.name} />
				<div class="text-base font-bold leading-[2.25rem] text-monsoon lg:leading-[3.5rem]">or</div>
				<Button
					label="Existing Client"
					onClick={() => {
						isNewClient = false;
						newClient = {};
					}}
					style="outline"
					isAnimated={false}
				/>
			</div>
		{/if}
	</div>

	<!-- invoice id -->
	<div class="field col-span-6 row-start-1 md:col-span-2 md:row-start-auto ">
		<label for="invoiceNumber">Invoice ID</label>
		<input type="number" name="id" required bind:value={invoice.invoiceNumber} />
	</div>

	<!-- new client -->
	{#if isNewClient}
		<div class="field col-span-6 grid gap-x-5" transition:slide>
			<div class="field col-span-6">
				<label for="email">Client's Email</label>
				<input
					type="email"
					name="email"
					id="email"
					required={isNewClient}
					bind:value={newClient.email}
				/>
			</div>

			<div class="field col-span-6">
				<label for="street">Street</label>
				<input type="text" name="street" id="street" bind:value={newClient.street} />
			</div>

			<div class="field col-span-2">
				<label for="city">City</label>
				<input type="text" name="city" id="city" bind:value={newClient.city} />
			</div>

			<div class="field col-span-2">
				<label for="state">State</label>
				<select name="state" id="state" bind:value={newClient.state}>
					<option />
					{#each states as state}
						<option value={state.value}>{state.name}</option>
					{/each}
				</select>
			</div>
			<div class="field col-span-2">
				<label for="zip">Zip Code</label>
				<input type="text" name="zip" id="zip" bind:value={newClient.zip} />
			</div>
		</div>
	{/if}

	<!-- due date -->
	<div class="field col-span-3 md:col-span-2 ">
		<label for="dueDate">Due Date</label>
		<!-- svelte-ignore missing-declaration -->
		<input type="date" name="dueDate" min={today} required bind:value={invoice.dueDate} />
	</div>
	<!-- issue date -->
	<div class="field col-span-3 md:col-span-2 md:col-start-5">
		<label for="issueDate">Issue Date</label>
		<input type="date" name="issueDate" min={today} bind:value={invoice.issueDate} />
	</div>
	<!-- subject -->
	<div class="field col-span-6">
		<label for="subject">Subject</label>
		<input type="text" name="subject" bind:value={invoice.subject} />
	</div>
	<!-- line items -->
	<div class="field col-span-6">
		<LineItemRows
			discount={invoice.discount}
			lineItems={invoice.lineItems}
			on:addLineItem={AddLineItem}
			on:removeLineItem={RemoveLineItem}
			on:updateLineItem={UpdateLineItem}
			on:updateDiscount={updateDiscount}
		/>
	</div>

	<!-- notes -->
	<div class="field col-span-6">
		<label for="notes">Notes<span class="font-normal">(optional, displayed on invoice)</span></label
		>
		<textarea name="notes" id="notes" bind:value={invoice.notes} />
	</div>
	<!-- terms -->
	<div class="field col-span-6">
		<label for="terms"
			>Terms <span class="font-normal">(optional, enter your terms and conditions)</span></label
		>
		<textarea name="terms" id="terms" bind:value={invoice.terms} />
		<div class="text-xs text-gray-400">
			Formatting tips: <strong>*bold*, <em>_italics_</em></strong>
		</div>
	</div>
	<!-- buttons -->
	<div class="field col-span-2">
		<!-- only be visible if editing -->
		{#if formState === 'edit'}
			<Button
				style="textOnlyDestructive"
				label="Delete"
				isAnimated={false}
				onClick={() => {
					isModalShowing = true;
				}}
				iconLeft={Trash}
			/>
		{/if}
	</div>
	<div class="field col-span-4 flex justify-end gap-x-5">
		<Button
			style="secondary"
			label="Cancel"
			isAnimated={false}
			onClick={() => {
				closePanel();
			}}
		/>
		<button
			type="submit"
			class="button translate-y-0 bg-lavenderIndigo text-white shadow-colored transition-all hover:-translate-y-2 hover:shadow-coloredHover"
			>Save</button
		>
	</div>
</form>

<ConfirmDelete
	{invoice}
	{isModalShowing}
	on:close={() => {
		isModalShowing = false;
		closePanel();
	}}
/>
