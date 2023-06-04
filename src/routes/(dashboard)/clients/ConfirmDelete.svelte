<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import { deleteClient } from '$lib/stores/ClientStore';
	import { createEventDispatcher } from 'svelte';

	export let client: Client;
	export let isModalShowing = false;
	const dispatch = createEventDispatcher();

	const handleDelete = async () => {
		await deleteClient(client);
		dispatch('close');
	};
</script>

<Modal isVisible={isModalShowing} on:close>
	<div class="flex h-full min-h-[175px] flex-col items-center justify-between gap-6">
		<div class="text-center text-xl font-bold text-daisyBush">
			Are you sure you want to delete this client <span class="text-scarlet">{client.name}</span> and
			all their invoices?
		</div>
		<div class="flex gap-4">
			<Button
				isAnimated={false}
				style="secondary"
				label="Cancel"
				onClick={() => {
					dispatch('close');
				}}
			/>
			<Button
				isAnimated={false}
				style="destructive"
				label="Yes, Delete It"
				onClick={() => handleDelete()}
			/>
		</div>
	</div>
</Modal>
