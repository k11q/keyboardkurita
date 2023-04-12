<template>
	<div class="flex gap-2 bg-neutral-900 rounded p-2">
		<button
			v-for="tab in props.tabs"
			@click="changeTab(tab)"
			:class="`rounded-md px-4 py-3 w-full ${
				currentActiveTab === tab ? 'bg-neutral-700' : ' bg-neutral-800'
			}`"
		>
			{{ tab }}
		</button>
	</div>
</template>

<script setup>
const router = useRouter();
const currentActiveTab = useState("currentActiveSettingsTab");

function changeTab(tab) {
	router.push({ query: { tab: tab } });
	currentActiveTab.value = tab;
}

const props = defineProps({
        tabs: Array
})
</script>
