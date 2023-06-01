<script lang="ts">
	import { clickOutside } from '$lib/actions/ClickOutside';
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
	import { swipe } from '$lib/actions/Swipe';
	import Cancel from '$lib/components/Icon/Cancel.svelte';

	export let client: Client;

	let isAdditionalMenuShowing = false;
	let isClientFormShowing = false;
	let triggerReset = false;

	const closePanel = () => {
		isClientFormShowing = false;
	};

	const receivedInvoices = () => {
		if (client?.invoice) {
			// find all invoices that have been paid
			const paidInvoices = client.invoice.filter((invoice) => invoice.invoiceStatus === 'paid');

			//get the sum of all of the invoices
			return sumInvoices(paidInvoices);
		}
		return 0;
	};

	const balanceInvoices = () => {
		if (client?.invoice) {
			// find all invoices that have not been paid
			const paidInvoices = client.invoice.filter((invoice) => invoice.invoiceStatus !== 'paid');

			//get the sum of all of the invoices
			return sumInvoices(paidInvoices);
		}
		return 0;
	};

	const handleEdit = () => {
		isClientFormShowing = true;
		isAdditionalMenuShowing = false;
	};

	const handleArchiveClient = () => {
		client.clientStatus = 'archive';
		isAdditionalMenuShowing = false;
	};

	const handleActivateClient = () => {
		client.clientStatus = 'active';
		isAdditionalMenuShowing = false;
	};

	const handleDeleteClient = () => {
		console.log('deleting');
	};
</script>

<div class="relative">
	<div
		class="client-table client-row relative z-row rounded-lg bg-white py-3 shadow-tableRow lg:py-6"
		use:swipe={{ triggerReset }}
		on:outOfView={() => {
			triggerReset = false;
		}}
	>
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
			<a href={`/clients/${client.id}`} class="view text-pastelPurple hover:text-daisyBush"
				><View /></a
			>
		</div>
		<div
			class="three-dots relative hidden items-center justify-center lg:flex"
			use:clickOutside={() => (isAdditionalMenuShowing = false)}
		>
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
						{ label: 'Delete', icon: Trash, onClick: handleDeleteClient, disabled: false },
						{
							label: 'Archive',
							icon: Archive,
							onClick: handleArchiveClient,
							disabled: client.clientStatus === 'archive'
						},
						{
							label: 'Activate',
							icon: Activate,
							onClick: handleActivateClient,
							disabled: client.clientStatus === 'active'
						}
					]}
				/>
			{/if}
		</div>
	</div>

	<!--Swipe to reveal content -->
	<div class="swipe-revealed-actions">
		<button
			class="action-button"
			on:click={() => {
				triggerReset = true;
			}}
		>
			<Cancel width={32} height={32} />
			Cancel
		</button>
		<button class="action-button" on:click={handleEdit}>
			<Edit width={32} height={32} />
			Edit
		</button>
		{#if client.clientStatus === 'active'}
			<button class="action-button" on:click={handleArchiveClient}>
				<Archive width={32} height={32} />
				Archive
			</button>
		{/if}
		{#if client.clientStatus === 'archive'}
			<button class="action-button" on:click={handleActivateClient}>
				<Activate width={32} height={32} />
				Activate
			</button>
		{/if}
		<button class="action-button" on:click={handleDeleteClient}>
			<Trash width={32} height={32} />
			Delete
		</button>
		<a href={`/clients/${client.id}`} class="action-button">
			<View width={32} height={32} />
			View
		</a>
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
