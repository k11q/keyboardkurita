<template>
	<div class="flex-grow w-full flex flex-col items-center">
		<div
			class="w-full max-w-6xl px-6 grid grid-cols-12 gap-6 py-10"
		>
			<div
				class="col-span-4 border bg-neutral-800/40 border-neutral-700 rounded-xl px-5 py-3"
			>
				<div>Total users</div>
				<div class="text-3xl">
					{{ stats.total_users }}
				</div>
			</div>
			<div
				class="col-span-4 border bg-neutral-800/40 border-neutral-700 rounded-xl px-5 py-3"
			>
				<div>Total sessions</div>
				<div class="text-3xl">
					{{ stats.total_sessions }}
				</div>
			</div>
			<div
				class="col-span-4 border bg-neutral-800/40 border-neutral-700 rounded-xl px-5 py-3"
			>
				<div>Total durations</div>
				<div class="text-3xl">
					{{ formattedDuration }}
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
definePageMeta({
	middleware: 'auth',
});

const client = useSupabaseClient();

const { data: stats } = await useLazyAsyncData('stats', async () => {
	const { data, error } = await client.from('stats').select().single();
	console.log(data)
	return data;
});

const formattedDuration = computed(()=>{
	return formatTime(stats.value.total_duration)
})

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.round(seconds % 60);
  return `${minutes}mins ${remainingSeconds} seconds`;
}
</script>
