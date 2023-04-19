<template>
	<transition
		enter-active-class="transition duration-100 ease-out"
		enter-from-class="transform scale-95 opacity-0"
		enter-to-class="transform scale-100 opacity-100"
		leave-active-class="transition duration-75 ease-in"
		leave-from-class="transform scale-100 opacity-100"
		leave-to-class="transform scale-95 opacity-0"
	>
		<HeadlessMenuItems
			class="absolute z-50 right-0 mt-2 w-56 origin-top-right divide-y divide-neutral-900 rounded-md bg-neutral-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
		>
			<div class="px-1 py-1">
				<HeadlessMenuItem v-slot="{ active }">
					<NuxtLink to="/profile">
						<button
							:class="[
								active
									? 'bg-neutral-700 text-white'
									: 'text-neutral-400',
								'group flex w-full items-center rounded-md px-2 py-2 text-sm',
							]"
						>
							<span>
								<Icon
									name="heroicons:pencil-20-solid"
									class="mr-2 h-5 w-5 text-violet-500"
								/></span>
							View profile
						</button>
					</NuxtLink>
				</HeadlessMenuItem>
				<HeadlessMenuItem v-slot="{ active }">
					<button
						:class="[
							active
								? 'bg-neutral-700 text-white'
								: 'text-neutral-400',
							'group flex w-full items-center rounded-md px-2 py-2 text-sm',
						]"
						@click="logout()"
					>
						<Icon
							:active="active"
							aria-hidden="true"
							name="heroicons:document-duplicate-20-solid"
							class="mr-2 h-5 w-5 text-violet-500"
						/>
						Log out
					</button>
				</HeadlessMenuItem>
			</div>
		</HeadlessMenuItems>
	</transition>
</template>

<script setup lang="ts">
const client = useSupabaseAuthClient();
const logout = async () => {
	const { error } = await client.auth.signOut();
	if (error) {
		return alert('Something went wrong !');
	}
};
</script>
