<template>
	<div
		class="w-full h-14 flex justify-center border-b border-neutral-800 flex-none z-20 relative top-0 text-sm"
	>
		<div class="flex max-w-6xl w-full ">
			<div
				class="flex-none h-full flex items-center justify-center w-14 border-x border-neutral-800"
			>
				<NuxtLink to="/">
					<button
						class="h-full items-center px-3 font-medium text-xl font-mono"
					>
						<span class="">🐙</span>
					</button>
				</NuxtLink>
			</div>
			<div
				class="flex-grow items-center grid grid-cols-5 [&>*]:border-r [&>*]:border-neutral-800 hover:[&>*]:bg-neutral-700/20 [&>*]:transtion-all"
			>
				<div
					class="flex-grow h-full flex items-center justify-center"
				>
					<NuxtLink
						to="/"
						class="h-full w-full flex justify-center items-center px-3 rounded-lg"
					>
						<span>Play</span>
					</NuxtLink>
				</div>
				<div
					class="flex-grow h-full flex items-center justify-center"
				>
					<NuxtLink
						to="/leaderboard"
						class="h-full w-full flex justify-center items-center px-3 rounded-lg"
					>
						<span>Leaderboard</span>
					</NuxtLink>
				</div>
				<div
					class="flex-grow h-full flex items-center justify-center"
				>
					<NuxtLink
						to="/sessions"
						class="h-full w-full flex justify-center items-center px-3 rounded-lg"
					>
						<span>Sessions</span>
					</NuxtLink>
				</div>
				<div
					class="flex-grow h-full flex items-center justify-center"
				>
					<NuxtLink
						to="/stats"
						class="h-full w-full flex justify-center items-center px-3 rounded-lg"
					>
						<span>Stats</span>
					</NuxtLink>
				</div>
				<div
					class="flex-grow h-full flex items-center justify-center"
				>
					<button
						v-if="!user"
						class="h-full items-center px-3 rounded-lg"
						@click="login('google')"
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
								class="inline-flex w-full justify-centerbg-black items-center rounded-lg bg-opacity-20 px-4 py-1 h-[35px] text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
							>
								<div>
									{{
										profile?.username
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
									>
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
const profile = useState('profile')
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

const logout = async () => {
	const { error } = await client.auth.signOut();
	if (error) {
		return alert('Something went wrong !');
	}
};
</script>
