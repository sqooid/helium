<script lang="ts">
	import { goto } from '$app/navigation';
	import { checkDomain, login } from '$lib/client/account';
	import { DBError } from '$lib/client/common';
	import { HeliumHttpError } from '$lib/client/error';
	import { getSite } from '$lib/client/site';
	import Button from '$lib/components/input/button.svelte';
	import EmailInput from '$lib/components/input/email-input.svelte';
	import PasswordInput from '$lib/components/input/password-input.svelte';
	import TextInput from '$lib/components/input/text-input.svelte';
	import TopBackBar from '$lib/components/navigation/top-back-bar.svelte';
	import { addAccount } from '$lib/database/account';
	import { defaultFieldErrors } from '$lib/helpers/validation';
	import { currentAccount } from '$lib/stores/theme';
	import { toast } from '$lib/stores/toast';
	import { debounce } from 'lodash-es';
	import * as yup from 'yup';

	const schema = yup.object({
		instanceDomain: yup
			.string()
			.matches(/[a-z0-9\.]+/)
			.required('Instance domain name is required')
			.default(''),
		usernameOrEmail: yup.string().required('Username or email is required').default(''),
		password: yup.string().required('Password is required').default('')
	});

	const fields: yup.InferType<typeof schema> = schema.getDefault();
	let errors = defaultFieldErrors(fields);

	let loadingDomain = false;
	const checkDomainDebounced = debounce(async (d: string) => {
		loadingDomain = true;
		const result = await checkDomain(d);
		if (!result) errors.instanceDomain = 'Could not connect to instance';
		else errors.instanceDomain = null;
		loadingDomain = false;
	}, 1000);
	$: if (fields.instanceDomain) {
		checkDomainDebounced(fields.instanceDomain);
	}

	const onBack = () => {
		goto('/account');
	};

	let loading = false;
	const onClickLogin = async () => {
		loading = true;
		try {
			errors = defaultFieldErrors(fields);
			const validated = await schema.validate(fields);
			const jwt = await login(
				validated.instanceDomain,
				validated.usernameOrEmail,
				validated.password
			);
			// Login successful
			if (!jwt) {
				toast.show({ type: 'failure', message: 'Failed to get token from server' });
				return;
			}
			// Get more details about user
			const site = await getSite({ domain: validated.instanceDomain, jwt });
			const localUser = site.my_user?.local_user_view.local_user;
			const person = site.my_user?.local_user_view.person;
			if (!localUser || !person) {
				toast.show({ type: 'failure', message: 'Failed to get user info' });
				return;
			}

			const newAccount = {
				domain: validated.instanceDomain,
				email: localUser.email ?? '',
				displayName: person.display_name ?? '',
				username: person.name,
				userId: localUser.id,
				personId: localUser.person_id,
				pfpUrl: person.avatar ?? '',
				jwt
			};
			await addAccount(newAccount);
			currentAccount.setAccount(newAccount.domain, newAccount.username);
			toast.show({ type: 'success', message: 'Login successful' });
			goto('/account');
		} catch (error) {
			console.dir(error);
			if (error instanceof HeliumHttpError) {
				if (error.status === 400) {
					errors.password = 'Username or password incorrect';
				}
			}
			if (error instanceof yup.ValidationError) {
				if (error.path && error.path in errors) (errors as any)[error.path] = error.message;
			}
			if (error instanceof DBError) {
				toast.show({ type: 'failure', message: error.message });
			}
		}
		loading = false;
	};
</script>

<svelte:head>
	<title>Add Account</title>
</svelte:head>

<TopBackBar on:back={onBack} title="Add Account" />

<div class="flex flex-col items-center gap-8">
	<div class="flex flex-col p-12 gap-6 mt-12 max-w-prose w-full">
		<TextInput
			label="Instance domain name"
			hint="e.g. lemmy.world"
			canError
			bind:value={fields.instanceDomain}
			errorText={errors.instanceDomain}
			loading={loadingDomain}
		/>
		<EmailInput
			label="Username or email"
			hint="john.doe@email.com"
			bind:value={fields.usernameOrEmail}
			canError
			errorText={errors.usernameOrEmail}
		/>
		<PasswordInput
			label="Password"
			hint="aJ7#hsn(Q"
			bind:value={fields.password}
			canError
			errorText={errors.password}
		/>
	</div>
	<Button canEnter label="Login" on:click={onClickLogin} {loading} />
</div>

<style lang="postcss">
</style>
