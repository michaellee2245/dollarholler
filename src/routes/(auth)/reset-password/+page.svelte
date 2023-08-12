<script lang="ts">
	import { goto } from '$app/navigation';
	import Alert from '$lib/components/Alert.svelte';
	import Loader from '$lib/components/Loader.svelte';
	import supabase from '$lib/utils/supabase';

	let newPassword: string = '',
		confirmPassword: string = '',
		message: string = '',
		loading = false;

	const handleSubmit = async () => {
		loading = true;
		if (newPassword !== confirmPassword) {
			message = "Passwords don't match";
			loading = false;
			return;
		}

		const { data, error } = await supabase.auth.updateUser({ password: newPassword });

		if (error) {
			console.error(error.message);
			loading = false;
			return;
		}

		message = 'Your password was updated';
		loading = false;

		goto('/invoices');
	};
</script>

<h1 class="auth-heading">Reset my Password</h1>

<Alert {message} />
<form on:submit|preventDefault={handleSubmit}>
	<fieldset disabled={loading}>
		<div class="field">
			<label for="newPassword" class="text-goldenFizz">Enter New Password</label>
			<input type="password" name="newPassword" required bind:value={newPassword} />
		</div>
		<div class="field">
			<label for="confirmPassword" class="text-goldenFizz">Confirm New Password</label>
			<input type="password" name="confirmPassword" required bind:value={confirmPassword} />
		</div>
		<button type="submit" class="auth-button flex items-center justify-center gap-x-2">
			{#if loading}
				<Loader /> Loading
			{:else}
				Update my Password!
			{/if}
		</button>
		<p class="mt-4 text-center text-sm text-white">
			<a href="/login" class="underline hover:no-underline">I'm ready to login</a>
		</p>
	</fieldset>
</form>
