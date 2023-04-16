<template>
	<div
		class="w-full h-14 flex justify-center border-b border-neutral-800 flex-none z-90 relative top-0 px-10 text-sm"
	>
	<div class="flex max-w-6xl ">
	<div
				class="flex-none h-full flex items-center justify-center w-14 border-x border-neutral-800"
			>
				<NuxtLink to="/"
					><button
						class="h-full items-center px-3 font-medium text-xl font-mono"
					>
						<span class="">🐙</span>
					</button></NuxtLink
				>
			</div>
		<div
			class="flex-grow items-center grid grid-cols-5 [&>*]:border-r [&>*]:border-neutral-800"
		>
			
			<div
				class="flex-grow h-full flex items-center justify-center"
			>
				<span>Play</span>
			</div>
			<div
				class="flex-grow h-full flex items-center justify-center"
			>
				<span>Leaderboard</span>
			</div>
			<div
				class="flex-grow h-full flex items-center justify-center"
			>
				<span>Sessions</span>
			</div>
			<div
				class="flex-grow h-full flex items-center justify-center"
			>
			<NuxtLink to="/stats"
					><button
						class="h-full items-center px-3 rounded-lg"
					>
						Stats
					</button></NuxtLink
				>
			</div>
			<div
				class="flex-grow h-full flex items-center justify-center"
			>
			<button
					class="h-full items-center px-3 hover:bg-neutral-800 rounded-lg"
					@click="login('google')"
					v-if="!user"
				>
					Log in
				</button>
				<HeadlessMenu
					v-if="user"
					as="div"
					class="relative inline-block text-left"
				>
					<div>
						<HeadlessMenuButton
							class="inline-flex w-full justify-centerbg-black items-center hover:bg-neutral-800 rounded-lg bg-opacity-20 px-4 py-1 h-[35px] text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
						>
							<div>
								{{
									user
										.user_metadata
										.full_name
								}}
							</div>
							<div
								class="ml-3 flex-none w-6 h-6 rounded-full overflow-clip"
							>
								<img
									:src="
										user
											.user_metadata
											.avatar_url
									"
									class=""
								/>
							</div>
							<Icon
								aria-hidden="true"
								name="heroicons:chevron-down-20-solid"
								class="ml-2 -mr-1 h-5 w-5 text-violet-200 hover:text-violet-100"
							/>
						</HeadlessMenuButton>
					</div>
					<UIDropdown />
				</HeadlessMenu>
			</div>
		</div>
	</div>
</div>
</template>

<script setup lang="ts">
const user = useSupabaseUser();
const client = useSupabaseAuthClient();
const router = useRouter();
// Login method using providers
const login = async (
	provider: "github" | "google" | "gitlab" | "bitbucket"
) => {
	const { error } = await client.auth.signInWithOAuth({
		provider,
		options: { redirectTo: "window.location.origin" },
	});
	if (error) {
		return alert("Something went wrong !");
	}
	router.push("/");
};

const logout = async () => {
	const { error } = await client.auth.signOut();
	if (error) {
		return alert("Something went wrong !");
	}
};
</script>
