<template>
	<div class="flex items-center justify-center w-full flex-grow px-6">
		<div
			class="w-full max-w-xl min-h-[20rem] border border-neutral-700 rounded-lg flex flex-col justify-center p-5"
		>
                        <div class="text-xl font-mono mb-3">Login required to save your progress</div>
			<button
				@click="login('google')"
				class="px-4 py-2 text-lg rounded-md border border-neutral-700 bg-neutral-800"
			>
				Login with google
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">
const user = useSupabaseUser();
const client = useSupabaseAuthClient();
const router = useRouter();
// Login method using providers
const login = async (
	provider: 'github' | 'google' | 'gitlab' | 'bitbucket'
) => {
	const { error } = await client.auth.signInWithOAuth({
		provider,
		options: { redirectTo: 'window.location.origin' },
	});
	if (error) {
		return alert('Something went wrong !');
	}
	router.push('/');
};

watchEffect(() => {
	if (user.value) {
		router.push('/');
	}
});
</script>
