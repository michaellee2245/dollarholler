<script lang="ts">
	import { goto } from '$app/navigation';
	import supabase from '$lib/utils/supabase';
	import { onMount } from 'svelte';

	onMount(async () => {
		let { error } = await supabase.auth.signOut();

		if (error) {
			console.error(error);
		}

		goto('/login');
	});
</script>
