<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Button from '$lib/components/Button.svelte';
	import CircledAmount from '$lib/components/CircledAmount.svelte';
	import LineItemRow from './LineItemRow.svelte';
	import {
		centsToDollars,
		sumLineItems,
		twoDecimals,
		addThousandsSeparator
	} from '$lib/utils/moneyHelpers';

	let subtotal: string = '0.00';
	export let discount: number = 0;
	let discountedAmount: string = '0.00';
	let total: string = '0.00';
	export let isEditable = true;

	export let lineItems: LineItem[] | undefined = undefined;
	let dispatch = createEventDispatcher();

	$: if (sumLineItems(lineItems) > 0) {
		subtotal = centsToDollars(sumLineItems(lineItems));
	}
	$: if (subtotal && discount) {
		discountedAmount = centsToDollars(sumLineItems(lineItems) * (discount / 100));
	}
	$: {
		const plainSubTotal = subtotal.replace(',', '');
		total = addThousandsSeparator(twoDecimals(Number(plainSubTotal) - Number(discountedAmount)));
	}
</script>

<div class="invoice-line-item border-b-2 pb-2 text-daisyBush">
	<div class="table-header">Description</div>
	<div class="table-header text-right">Unit Prices</div>
	<div class="table-header text-center">Qty</div>
	<div class="table-header text-right">Amount</div>
</div>

{#if lineItems}
	{#each lineItems as lineItem, index}
		<LineItemRow
			{lineItem}
			on:removeLineItem
			canDelete={index > 0}
			on:updateLineItem
			isRequired={index === 0}
			{isEditable}
		/>
	{/each}
{/if}

<div class="invoice-line-item">
	<div class="col-span-1 sm:col-span-2">
		{#if isEditable}
			<Button
				label="+ Line Item"
				style="textOnly"
				onClick={() => {
					dispatch('addLineItem');
				}}
				isAnimated={false}
			/>
		{/if}
	</div>
	<div class="py-5 text-right font-bold text-monsoon print:col-span-3">Subtotal</div>
	<div class="py-5 text-right font-mono">${subtotal}</div>
</div>

<div class="invoice-line-item">
	<div class="col-span-1 py-5 text-right font-bold text-monsoon print:col-span-3 sm:col-span-2">
		Discount
	</div>
	<div class="relative">
		<input
			class="line-item h-10 w-full border-b-2 border-dashed border-stone-300 pr-4 text-right focus:border-solid focus:border-lavenderIndigo focus:outline-none print:pr-0"
			type="number"
			name="discount"
			min="0"
			max="100"
			disabled={!isEditable}
			bind:value={discount}
			on:change={() => dispatch('updateDiscount', { discount })}
		/>
		<span class="absolute right-0 top-2 font-mono">%</span>
	</div>
	<div class="py-5 text-right font-mono">${discountedAmount}</div>
</div>

<div class="invoice-line-item">
	<div class="col-span-3 print:col-span-6 sm:col-span-6">
		<CircledAmount label="Total:" amount={`$${total}`} />
	</div>
</div>

<style lang="postcss">
	.table-header {
		@apply hidden text-sm font-bold text-daisyBush print:block sm:block;
	}
</style>
