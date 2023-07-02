<script lang="ts">
	import { goto } from '$app/navigation';
	import { checkDomain } from '$lib/client/account';
	import Button from '$lib/components/input/button.svelte';
	import EmailInput from '$lib/components/input/email-input.svelte';
	import PasswordInput from '$lib/components/input/password-input.svelte';
	import TextInput from '$lib/components/input/text-input.svelte';
	import TopBackBar from '$lib/components/navigation/top-back-bar.svelte';
	import * as yup from 'yup';

	const schema = yup.object({
		instanceDomain: yup
			.string()
			.matches(/[a-z0-9\.]+/)
			.required()
			.default(''),
		usernameOrEmail: yup.string().required().default(''),
		password: yup.string().required().default('')
	});

	const fields: yup.InferType<typeof schema> = schema.getDefault();

	$: if (fields.instanceDomain) {
		checkDomain(fields.instanceDomain);
	}

	const onBack = () => {
		goto('/account');
	};

	let loading = false;
	const onClickLogin = () => {
		loading = !loading;
	};
</script>

<TopBackBar on:back={onBack} title="Add Account" />

<div class="flex flex-col items-center gap-8">
	<div class="flex flex-col p-12 gap-6 mt-12 max-w-prose w-full">
		<TextInput
			label="Instance domain name"
			hint="e.g. lemmy.world"
			canError
			bind:value={fields.instanceDomain}
			errorText={fields.instanceDomain}
		/>
		<EmailInput
			label="Username or email"
			hint="john.doe@email.com"
			bind:value={fields.usernameOrEmail}
		/>
		<PasswordInput label="Password" hint="aJ7#hsn(Q" bind:value={fields.password} />
	</div>
	<Button label="Login" on:click={onClickLogin} {loading} />
</div>

<style lang="postcss">
</style>
