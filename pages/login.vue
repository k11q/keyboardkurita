<template>
	<div class="flex items-center justify-center w-full flex-grow px-6 font-mono">
		<div
			class="w-full max-w-md border border-neutral-700 rounded-2xl flex flex-col justify-center px-10 pt-10 pb-8"
		>
                        <div class="text-xl ">Login/singup</div>
			<div class="text-neutral-500 mb-6">Login required to save your progress</div>
			<button
				@click="login('google')"
				class="px-4 py-3 text rounded-lg border border-sky-600 bg-sky-700 mb-3 hover:bg-sky-600"
			>
				Login with google
			</button>
			<button
				@click="login('github')"
				class="px-4 py-3 text rounded-lg border border-neutral-700 bg-neutral-800 hover:bg-neutral-700"
			>
				Login with github
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
