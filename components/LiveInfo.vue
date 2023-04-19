<template>
	<div
		v-show="sessionRunning"
		class="flex justify-center mb-5 absolute top-0 left-0 right-0 pt-10"
	>
		<div
			class="grid grid-cols-3 gap-4 [&>*]:flex [&>*]:flex-col [&>*]:items-center min-w-[340px]"
		>
			<div>
				<div class="text-neutral-500 text-sm">time</div>
				<div
					class="text-3xl font-medium font-mono text-[#FECC1B]"
				>
					{{ props.liveTimer }}
				</div>
			</div>
			<div>
				<div class="text-neutral-500 text-sm">wpm</div>
				<div
					class="text-3xl font-medium font-mono text-[#6BD968]"
				>
					{{ props.liveWpm.toFixed(1) }}
				</div>
			</div>
			<div>
				<div class="text-neutral-500 text-sm">raw</div>
				<div
					class="text-3xl font-medium font-mono text-[#3DEFE9]"
				>
					{{ props.liveRaw.toFixed(1) }}
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
const props = defineProps({
	sessionRunning: Boolean,
	liveTimer: { type: Number, default: 0 },
	liveWpm: { type: Number, default: 0 },
	liveRaw: { type: Number, default: 0 },
});
</script>
