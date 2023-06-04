<script lang="ts">
	import { goto } from '$app/navigation';
	import supabase from '$lib/utils/supabase';
	import { onMount } from 'svelte';

	onMount(async () => {
		const {
			data: { session },
			error
		} = await supabase.auth.getSession();

		if (session) {
			await goto('/invoices');
			return;
		}
	});
</script>

<slot><!-- optional fallback --></slot>
