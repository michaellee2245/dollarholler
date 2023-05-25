<script lang="ts">
	import AdditionalOptions from '$lib/components/AdditionalOptions.svelte';
	import Edit from '$lib/components/Icon/Edit.svelte';
	import ThreeDots from '$lib/components/Icon/ThreeDots.svelte';
	import Trash from '$lib/components/Icon/Trash.svelte';
	import View from '$lib/components/Icon/View.svelte';
	import Activate from '$lib/components/Icon/Activate.svelte';
	import Archive from '$lib/components/Icon/Archive.svelte';
	import Tag from '$lib/components/Tag.svelte';
	import { centsToDollars, sumInvoices } from '$lib/utils/moneyHelpers';
	import SlidePanel from '$lib/components/SlidePanel.svelte';
	import ClientForm from './ClientForm.svelte';

	export let client: Client;
	console.log({ client });

	let isAdditionalMenuShowing = false;
	let isClientFormShowing = false;

	const closePanel = () => {
		isClientFormShowing = false;
	};

	const receivedInvoices = () => {
		if (client?.invoices) {
			// find all invoices that have been paid
			const paidInvoices = client.invoices.filter((invoice) => invoice.invoiceStatus === 'paid');

			//get the sum of all of the invoices
			return sumInvoices(paidInvoices);
		}
		return 0;
	};

	const balanceInvoices = () => {
		if (client?.invoices) {
			// find all invoices that have not been paid
			const paidInvoices = client.invoices.filter((invoice) => invoice.invoiceStatus !== 'paid');

			//get the sum of all of the invoices
			return sumInvoices(paidInvoices);
		}
		return 0;
	};

	const handleEdit = () => {
		isClientFormShowing = true;
		isAdditionalMenuShowing = false;
	};
</script>

<div class="client-table client-row rounded-lg bg-white py-3 shadow-tableRow lg:py-6">
	<div class="status"><Tag className="ml-auto" label={client.clientStatus} /></div>
	<div class="client-name truncate whitespace-nowrap text-base font-bold lg:text-xl">
		{client.name}
	</div>
	<div class="received text-right font-mono text-sm font-bold lg:text-lg">
		${centsToDollars(receivedInvoices())}
	</div>
	<div class="balance text-right font-mono text-sm font-bold text-scarlet lg:text-lg">
		${centsToDollars(balanceInvoices())}
	</div>
	<div class="relative hidden items-center justify-center lg:flex">
		<a href="#" class="view text-pastelPurple hover:text-daisyBush"><View /></a>
	</div>
	<div class="three-dots relative hidden items-center justify-center lg:flex">
		<button
			class="text-pastelPurple hover:text-daisyBush"
			on:click={() => {
				isAdditionalMenuShowing = !isAdditionalMenuShowing;
			}}><ThreeDots /></button
		>

		{#if isAdditionalMenuShowing}
			<AdditionalOptions
				options={[
					{ label: 'Edit', icon: Edit, onClick: () => handleEdit(), disabled: false },
					{ label: 'Delete', icon: Trash, onClick: () => console.log('deleting'), disabled: false },
					{
						label: 'Archive',
						icon: Archive,
						onClick: () => {
							client.clientStatus = 'archive';
							isAdditionalMenuShowing = false;
						},
						disabled: client.clientStatus === 'archive'
					},
					{
						label: 'Activate',
						icon: Activate,
						onClick: () => {
							client.clientStatus = 'active';
							isAdditionalMenuShowing = false;
						},
						disabled: client.clientStatus === 'active'
					}
				]}
			/>
		{/if}
	</div>
</div>

{#if isClientFormShowing}
	<SlidePanel on:closePanel={closePanel}>
		<ClientForm {closePanel} formStatus="edit" {client} />
	</SlidePanel>
{/if}

<style lang="postcss">
	.client-row {
		grid-template-areas:
			'clientName status'
			'received balance';
	}

	@media (min-width: 1024px) {
		.client-row {
			grid-template-areas: 'status clientName received balance view threeDots';
		}
	}

	.client-name {
		grid-area: clientName;
	}

	.status {
		grid-area: status;
	}

	.received {
		@apply text-left lg:text-right;
		grid-area: received;
	}
	.received:before {
		@apply block text-xs font-bold lg:hidden;
		content: 'Received: ';
	}

	.balance {
		grid-area: balance;
	}
	.balance:before {
		@apply block text-xs font-bold lg:hidden;
		content: 'Balance: ';
	}
	.view {
	}
</style>
