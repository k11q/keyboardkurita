<template>
	<div
		v-if="props.shouldShow"
		class="pb-20 z-20 rounded-lg text-xl font-mono absolute inset-0 bg-neutral-900/40 backdrop-blur-sm flex flex-col items-center justify-center"
	>
		<button
			class="py-10 mb-2 px-8 text-neutral-300 hover:text-white"
			@click="emit('buttonClick')"
		>
			<span class="mr-4">
				<Icon
					name="lucide:mouse-pointer-click"
					size="1.5rem"
				/>
			</span>

			<span>click to activate</span>
		</button>
		<!--MENU/SETTINGS BAR-->
		<div class="flex justify-center">
			<SettingsBar />
		</div>
	</div>
</template>

<script setup>
const props = defineProps({
	shouldShow: Boolean,
});

const emit = defineEmits(['buttonClick']);
</script>
