<template>
	<HeadlessSwitch
		v-model="enabled"
		:class="enabled ? 'bg-green-600' : 'bg-neutral-700'"
		class="relative inline-flex h-[32px] w-[55px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
	>
		<span class="sr-only">Use setting</span>
		<span
			aria-hidden="true"
			:class="enabled ? 'translate-x-6' : 'translate-x-0'"
			class="mt-0.5 ml-[1px] pointer-events-none inline-block h-[24px] w-[24px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out"
		/>
	</HeadlessSwitch>
</template>

<script setup>

const enabled = ref(false);
</script>
