<template>
	<div
		:class="`flex flex-col items-center flex-grow left-0 right-0 px-6 py-14 w-full max-w-6xl`"
	>
		<div class="w-full">
			<h2 class="font-mono text-4xl mb-6">Top</h2>
			<template v-if="leaderboard && leaderboard.length">
				<table
					class="w-full font-mono text-neutral-200 flex flex-col gap-0.5 m-0"
				>
					<thead
						class="flex flex-col gap-0.5 text-neutral-500 uppercase"
					>
						<tr
							class="h-7 grid grid-cols-13 bg-neutral-800/30 [&>*]:border-r-2 [&>*]:border-neutral-900"
						>
							<td
								class="flex items-center pr-0 py-0 pl-2"
							>
								<div>no</div>
							</td>
							<td
								class="col-span-5 flex items-center gap-4 p-0"
							>
								<div
									class="w-[35px] h-7 border-r-2 border-neutral-900"
								/>
								<div>user</div>
							</td>
							<td
								class="flex items-center pr-0 py-0 pl-2"
							>
								<div>wpm</div>
							</td>
							<td
								class="flex items-center pr-0 py-0 pl-2"
							>
								<div>raw</div>
							</td>
							<td
								class="flex items-center pr-0 py-0 pl-2"
							>
								<div>acc</div>
							</td>
							<td
								class="flex items-center pr-0 py-0 pl-2"
							>
								<div>
									consis
								</div>
							</td>
							<td
								class="col-span-3 flex items-center py-0 pr-4 justify-end"
							>
								<span
									>date</span
								>
							</td>
						</tr>
					</thead>
					<tbody class="flex flex-col gap-0.5">
						<tr
							v-for="(
								session, index
							) in leaderboard"
							:key="session.id"
							class="h-[33px] grid grid-cols-13 bg-neutral-800/60 even:bg-neutral-800/20 [&>*]:border-r-2 [&>*]:border-neutral-900"
						>
							<td
								class="flex items-center pr-0 py-0 pl-2"
							>
								<div>
									{{
										index +
										1
									}}
								</div>
							</td>
							<td
								class="col-span-5 flex items-center gap-4 p-0"
							>
								<div
									class="h-[33px] w-[35px] bg-neutral-600 border-r-2 border-neutral-900"
								/>
								<div>
									{{
										session.username
									}}
								</div>
							</td>
							<td
								class="flex items-center pr-0 py-0 pl-2"
							>
								<div>
									{{
										session.wpm.toFixed(
											1
										)
									}}
								</div>
							</td>
							<td
								class="flex items-center pr-0 py-0 pl-2"
							>
								<div>
									{{
										session.raw.toFixed(
											1
										)
									}}
								</div>
							</td>
							<td
								class="flex items-center pr-0 py-0 pl-2"
							>
								<div>
									{{
										session.accuracy.toFixed(
											1
										)
									}}%
								</div>
							</td>
							<td
								class="flex items-center pr-0 py-0 pl-2"
							>
								<div>
									{{
										session.consistency.toFixed(
											1
										)
									}}%
								</div>
							</td>
							<td
								class="col-span-3 flex items-center py-0 pr-4 justify-end text-neutral-400"
							>
								<span
									class="line-clamp-1"
									>{{
										format(
											new Date(
												session.end_time
											),
											'dd/MM/yyyy hh:mm a'
										)
									}}</span
								>
							</td>
						</tr>
					</tbody>
				</table>
			</template>
		</div>
	</div>
</template>

<script setup lang="ts">
import { format } from 'date-fns';
definePageMeta({
	middleware: 'auth',
});
//db & auth
const user = useSupabaseUser();
const client = useSupabaseClient();

// readonly
const PROFILE = useState('profile');
const USERNAME: globalThis.Ref<string> = computed(() => {
	return PROFILE.value ? PROFILE.value.username : 'username';
});

const { data: leaderboard } = await useLazyAsyncData(
	'leaderboard',
	async () => {
		const { data } = await client
			.from('leaderboard')
			.select()
			.limit(100);
		return data;
	}
);

watchEffect(async () => {
	if (user.value) {
		PROFILE.value = await getProfile(user.value.id);
	}
});

async function getProfile(userId: string) {
	const { data, error } = await client
		.from('profile')
		.select()
		.eq('user_id', userId)
		.single();
	if (error) {
		console.log(error);
		console.log(
			'no profile for users found. user needs to setup profile'
		);
	}
	return data;
}
</script>
