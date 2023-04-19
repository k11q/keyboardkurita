<template>
	<div class="flex items-center justify-center w-full flex-grow px-6">
		<div
			class="w-full max-w-xl min-h-[20rem] border border-neutral-700 rounded-lg flex flex-col justify-center p-5"
		>
			<div class="text-xl font-mono mb-3">Set username</div>
			<form @submit.prevent="setUsername" class="contents">
				<input
					name="username"
					class="pl-4 py-2 text-lg rounded-md border border-neutral-700 bg-neutral-800/50 mb-4"
				/>
				<button
					class="px-4 py-2 text-lg rounded-md border border-neutral-700 bg-neutral-700/50"
				>
					Set username
				</button>
				<div v-if="usernameError && !loading" class="text-red-500">Error... please try a different username</div>
				<div v-if="loading">Loading... checking name availability</div>
			</form>
		</div>
	</div>
</template>

<script setup lang="ts">
const user = useSupabaseUser();
const client = useSupabaseClient();
const router = useRouter();
const usernameError = ref(false)
const loading = ref(false)

async function setUsername(e: Event) {
	loading.value = true;
	const formData = new FormData(e.target);
	const name = formData.get('username');
	const { data, error } = await client
		.from('profile')
		.insert({ user_id: user.value.id, username: name })
		.select();
	if (error) {
		loading.value = false;
		usernameError.value = true;
		console.error(error);
	}else{
		router.push('/');
		usernameError.value = false;
	}
	loading.value = false;
}

onMounted(async () => {
	if (user.value) {
		const { data, error } = await client
			.from('profile')
			.select()
			.eq('user_id', user.value.id)
			.single();
		if (data) {
                        router.push('/');
		}
	}else if(!user.value){
                router.push('/login');
        }
});

watchEffect(()=>{
        if(!user.value){
                router.push('/');
        }
})

</script>
