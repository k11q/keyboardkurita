<template>
	<div class="flex justify-center text-neutral-500 text-sm">
		<div
			class="justify-evenly flex gap-6 hover:[&>*]:text-[#6BD968] hover:[&>*]:bg-neutral-800 [&>*]:bg-neutral-900 focus:[&>*]:ring-2 focus:[&>*]:ring-[#6BD968] focus:[&>*]:text-[#6BD968] focus:[&>*]:outline-none [&>*]:transition-all [&>*]:duration-100"
		>
			<button
				id="nextTest"
				class="rounded-md h-16 w-16 flex items-center justify-center"
				@click="onButtonClick"
			>
				<Icon name="lucide:play" size="1.25rem" />
			</button>
			<button
				class="rounded-md h-16 w-16"
				@click="onButtonClick"
			>
				<Icon name="lucide:repeat" size="1.25rem" />
			</button>
			<button
				class="rounded-md h-16 w-16"
				@click="onButtonClick"
			>
				<Icon
					name="lucide:alert-triangle"
					size="1.25rem"
				/>
			</button>
			<button
				class="rounded-md h-16 w-16"
				@click="onButtonClick"
			>
				<Icon name="lucide:step-back" size="1.25rem" />
			</button>
			<button
				class="rounded-md h-16 w-16"
				@click="onButtonClick"
			>
				<Icon name="lucide:align-left" size="1.25rem" />
			</button>
			<ScreenshotButton
				target-element-id="resultsChart"
				:date="props.date"
				:username="props.username"
			/>
		</div>
	</div>
</template>

<script setup>
const props = defineProps({
	date: { type: String, default: '{{date}}' },
	username: { type: String, default: '{{username}}' },
});

const emit = defineEmits(['buttonClick']);

const onButtonClick = () => {
	emit('buttonClick');
};
</script>
