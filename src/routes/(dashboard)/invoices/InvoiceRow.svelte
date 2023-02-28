<script lang="ts">
	import Tag from '$lib/components/Tag.svelte';
	import View from '$lib/components/Icon/View.svelte';
	import ThreeDots from '$lib/components/Icon/ThreeDots.svelte';
	import { centsToDollars, sumLineItems } from '$lib/utils/moneyHelpers';
	import { convertDate, isLate } from '$lib/utils/dateHelpers';
	import AdditionalOptions from '$lib/components/AdditionalOptions.svelte';
	import Send from '$lib/components/Icon/Send.svelte';
	import Edit from '$lib/components/Icon/Edit.svelte';
	import Trash from '$lib/components/Icon/Trash.svelte';

	export let invoice: Invoice;
	let isAdditionalMenuShowing = false;
	let isOptionDisabled = false;

	const handleDelete = () => console.log('deleting');
	const handleEdit = () => console.log('editing');
	const handleSendInvoice = () => console.log('sending invoice');

	const getInvoiceLabel = () => {
		if (invoice.invoiceStatus === 'draft') {
			return 'draft';
		} else if (invoice.invoiceStatus === 'sent' && !isLate(invoice.dueDate)) {
			isOptionDisabled = true;
			return 'sent';
		} else if (invoice.invoiceStatus === 'sent' && isLate(invoice.dueDate)) {
			isOptionDisabled = true;
			return 'late';
		} else if (invoice.invoiceStatus === 'paid') {
			isOptionDisabled = true;
			return 'paid';
		}
	};
</script>

<!-- invoices -->
<div
	class="invoice-table invoice-row items-center rounded-lg bg-white py-3 shadow-tableRow lg:py-6"
>
	<div class="status"><Tag className="ml-auto lg:ml-0" label={getInvoiceLabel()} /></div>
	<div class="dueDate text-sm lg:text-lg">{convertDate(invoice.dueDate)}</div>
	<div class="invoiceNumber text-sm lg:text-lg">{invoice.invoiceNumber}</div>
	<div class="clientName truncate whitespace-nowrap text-xl font-bold">{invoice.client.name}</div>
	<div class="amount text-right font-mono text-sm font-bold lg:text-lg">
		${centsToDollars(sumLineItems(invoice.lineItems))}
	</div>
	<div class="lg:center viewButton hidden text-sm lg:flex lg:text-lg">
		<a href="#" class="text-pastelPurple hover:text-daisyBush"><View /></a>
	</div>

	<div class="lg:center moreButton relative hidden text-sm lg:flex lg:text-lg">
		<button
			class="text-pastelPurple hover:text-daisyBush"
			on:click={() => {
				isAdditionalMenuShowing = !isAdditionalMenuShowing;
			}}><ThreeDots /></button
		>
		{#if isAdditionalMenuShowing}
			<AdditionalOptions
				options={[
					{ label: 'Edit', icon: Edit, onClick: handleEdit, disabled: isOptionDisabled },
					{ label: 'Delete', icon: Trash, onClick: handleDelete, disabled: false },
					{ label: 'Send', icon: Send, onClick: handleSendInvoice, disabled: isOptionDisabled }
				]}
			/>
		{/if}
	</div>
</div>

<style lang="postcss">
	.invoice-row {
		grid-template-areas:
			'invoiceNumber invoiceNumber'
			'clientName amount'
			'dueDate status';
	}

	@media (min-width: 1024px) {
		.invoice-row {
			grid-template-areas: 'status dueDate invoiceNumber clientName amount viewButton moreButton';
		}
	}

	.invoice-row .status {
		grid-area: status;
	}

	.invoice-row .dueDate {
		grid-area: dueDate;
	}

	.invoice-row .invoiceNumber {
		grid-area: invoiceNumber;
	}

	.invoice-row .clientName {
		grid-area: clientName;
	}

	.invoice-row .amount {
		grid-area: amount;
	}

	.invoice-row .viewButton {
		grid-area: viewButton;
	}

	.invoice-row .moreButton {
		grid-area: moreButton;
	}
</style>
