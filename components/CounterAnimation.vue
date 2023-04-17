<template>
	<span class="counter-animation" :class="extraClass" :style="extraStyle">
		{{ animatedValue }}
	</span>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, computed } from "vue";

const props = defineProps({
	value: Number,
	duration: {
		type: Number,
		default: 500,
	},
	extraClass: String,
	extraStyle: Object,
	digits: {
		type: Number,
		default: 0,
	},
});

const animatedValue = ref(0);
let targetValue = props.value;
let animationFrame = null;

const animateValue = () => {
	const startTime = performance.now();
	animatedValue.value = 0;
	const initialValue = 0;
	const targetDuration = props.duration;

	const update = (currentTime) => {
		const elapsed = currentTime - startTime;
		const progress = Math.min(elapsed / targetDuration, 1);
		const diff = targetValue - initialValue;
		const step = diff * progress;

		if (progress === 0) {
			animatedValue.value = initialValue;
		} else {
			animatedValue.value = parseFloat(
				(initialValue + step).toFixed(props.digits)
			);
		}

		if (Math.abs(diff) > 0.01 && progress < 1) {
			animationFrame = requestAnimationFrame(update);
		} else {
			animatedValue.value = targetValue;
		}
	};

	animationFrame = requestAnimationFrame(update);
};

watch(
	() => props.value,
	(newValue, oldValue) => {
		if (newValue !== oldValue) {
			targetValue = newValue;
			if (newValue !== 0) {
				animateValue();
			}
		}
	},
	{ immediate: true }
);

onMounted(() => {
	if (props.value !== 0) {
		animateValue();
	}
});

onUnmounted(() => {
	if (animationFrame) {
		cancelAnimationFrame(animationFrame);
	}
});
</script>
