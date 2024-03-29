<script lang="ts">
	import { invoices, loadInvoices } from '$lib/stores/InvoiceStore';
	import { onMount } from 'svelte';
	import Search from '$lib/components/Search.svelte';
	import CircledAmount from '$lib/components/CircledAmount.svelte';
	import InvoiceRow from './InvoiceRow.svelte';
	import { centsToDollars, sumInvoices } from '$lib/utils/moneyHelpers';
	import BlankState from './BlankState.svelte';
	import InvoiceRowHeader from './InvoiceRowHeader.svelte';
	import Portal from '$lib/components/Portal.svelte';
	import Button from '$lib/components/Button.svelte';
	import SlidePanel from '$lib/components/SlidePanel.svelte';
	import InvoiceForm from './InvoiceForm.svelte';
	import NoSearchResults from './NoSearchResults.svelte';

	let invoiceList: Invoice[] = [];
	let isInvoiceFormShowing: boolean = false;

	const SearchInvoices = (event: CustomEvent) => {
		const keywords = event.detail.searchTerms;
		invoiceList = $invoices.filter((invoice) => {
			return (
				invoice?.client?.name?.toLowerCase().includes(keywords.toLowerCase()) ||
				invoice?.invoiceNumber?.toLowerCase().includes(keywords.toLowerCase()) ||
				invoice?.subject?.toLowerCase().includes(keywords.toLowerCase())
			);
		});
		console.log(keywords);
	};

	const ClearSearch = (event: CustomEvent) => {
		if (event.detail.searchTerms === '') {
			invoiceList = $invoices;
		}
	};

	onMount(async () => {
		await loadInvoices();
		invoiceList = $invoices;
	});
</script>

<svelte:head>
	<title>Invoices | The Dollar Holler</title>
</svelte:head>

<div
	class="md:item-center mb-7 flex flex-col-reverse items-start justify-between gap-y-6 md:flex-row md:gap-y-4 lg:mb-16"
>
	<!-- Search Field -->
	{#if $invoices.length > 0}
		<Search on:search={SearchInvoices} on:clear={ClearSearch} />
	{:else}
		<div />
	{/if}

	<!-- New invoice button -->
	<Button
		label="+ Invoice"
		onClick={() => {
			isInvoiceFormShowing = true;
		}}
	/>
</div>

<!-- list of invoices -->
<div>
	<!-- invoices -->
	{#if $invoices === null}
		Loading...
	{:else if $invoices.length <= 0}
		<BlankState />
	{:else if invoiceList.length <= 0}
		<NoSearchResults />
	{:else}
		<InvoiceRowHeader className="text-daisyBush" />
		<div class="flex flex-col-reverse">
			{#each invoiceList as invoice}
				<InvoiceRow {invoice} />
			{/each}
		</div>
		<CircledAmount label="Total" amount={`$${centsToDollars(sumInvoices(invoiceList))}`} />
	{/if}
</div>

<!-- slide panel -->
{#if isInvoiceFormShowing}
	<SlidePanel
		on:closePanel={() => {
			isInvoiceFormShowing = false;
		}}
	>
		<InvoiceForm closePanel={() => (isInvoiceFormShowing = false)} />
	</SlidePanel>
{/if}
