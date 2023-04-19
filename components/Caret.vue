<template>
	<div
		v-if="props.isVisible"
		class="fixed z-40 h-11 w-1.5 bg-[#3992FF] transition-all duration-100 ease-linear"
		:style="caretStyle"
	/>
</template>

<script setup>
import { defineProps, computed } from 'vue';

const props = defineProps({
	isVisible: Boolean,
	caretLeft: { type: Number, default: 0 },
	caretTop: { type: Number, default: 0 },
});

const caretStyle = computed(() => {
	return `left: ${props.caretLeft - 3}px; top: ${props.caretTop - 2}px`;
});
</script>
