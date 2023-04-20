<template>
	<div
		class="flex items-center justify-center w-full flex-grow px-6 font-mono"
	>
		<div
			class="w-full max-w-md border border-neutral-700 rounded-2xl flex flex-col justify-center px-10 pt-10 pb-8"
		>
			<div class="text-xl">Set username</div>
			<div class="text-neutral-500 mb-6 text-sm">
				Only lowercase characters, numbers and
				underscores are valid.
			</div>
			<form @submit.prevent="setUsername" class="contents">
				<input
					name="username"
					v-model="username"
					@keypress="validateUsername($event)"
					:class="`pl-4 py-3 rounded-lg border border-neutral-700 bg-neutral-800/50 mb-3 focus:outline-none focus:ring-sky-600 focus:ring-2`"
				/>
				<button
					class="px-4 py-3 rounded-lg border border-neutral-700 bg-neutral-700/50 hover:bg-neutral-600"
				>
					Set username
				</button>
				<div
					v-if="usernameError && !loading"
					class="text-red-500 mt-2"
				>
					Username not available. Please try a
					diffferent username.
				</div>
				<div
					v-if="loading"
					class="text-neutral-500 mt-2"
				>
					Loading... checking name availability.
					Please wait.
				</div>
			</form>
		</div>
	</div>
</template>

<script setup lang="ts">
const user = useSupabaseUser();
const client = useSupabaseClient();
const router = useRouter();
const usernameError = ref(false);
const loading = ref(false);
const username = ref('');
const isUsernameValid = ref(false);

function validateUsername(event) {
	const regex = /^[a-z0-9_]+$/;
	isUsernameValid.value =
		regex.test(username.value) && username.value != '';
	if (!regex.test(event.key) && event.key != 'Enter') {
		event.preventDefault();
		event.stopImmediatePropagation();
	}
}

async function setUsername() {
	loading.value = true;
	const { data, error } = await client
		.from('profile')
		.insert({ user_id: user.value.id, username: username.value })
		.select();
	if (error) {
		loading.value = false;
		usernameError.value = true;
		console.error(error);
	} else {
		router.push('/');
		usernameError.value = false;
	}
	loading.value = false;
}

onMounted(async () => {
	if (user.value) {
		console.log(user.value);
		const { data, error } = await client
			.from('profile')
			.select()
			.eq('user_id', user.value.id)
			.single();
		if (data) {
			router.push('/');
		}
	} else if (!user.value) {
		router.push('/login');
	}
});

watchEffect(() => {
	if (!user.value) {
		router.push('/');
	}
});
</script>
