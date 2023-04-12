<template>
	<div
		class="w-full h-14 flex justify-center border-b border-neutral-600 flex-none"
	>
		<div
			class="w-full items-center px-10 max-w-7xl flex gap-6 justify-between"
		>
			<div class="h-full">
				<NuxtLink to="/"
					><button
						class="h-full items-center px-3 font-semibold text-xl"
					>
						<span class="mr-3">🐙</span
						><span>keyboardkurita</span>
					</button></NuxtLink
				>
			</div>
			<div class="h-full py-2.5 gap-4 flex">
				<NuxtLink to="/explore"
					><button
						class="h-full items-center px-3"
					>
						Explore
					</button></NuxtLink
				>
				<NuxtLink to="/settings"
					><button
						class="h-full items-center px-3 rounded"
					>
						Settings
					</button></NuxtLink
				>
				<button
					class="h-full items-center px-3 rounded"
					@click="login('google')"
					v-if="!user"
				>
					Log in
				</button>
				<button
					class="h-full items-center px-3 rounded"
					@click="logout()"
					v-if="user"
				>
					Log out
				</button>
				<NuxtLink v-if="user" to="/profile"
					><button
						class="h-full items-center px-3 flex gap-2"
					>
						<div>
							{{
								user
									.user_metadata
									.full_name
							}}
						</div>
						<div
							class="flex-none w-6 h-6 rounded-full overflow-clip"
						>
							<img
								:src="
									user
										.user_metadata
										.avatar_url
								"
								class=""
							/>
						</div></button
				></NuxtLink>
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
	const { error } = await client.auth.signInWithOAuth({ provider });
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
