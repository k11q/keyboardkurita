<template>
	<div class="pb-10 px-10 pt-8 max-w-7xl w-full h-full">
		<h1>Settings</h1>
		<div class="">
			<div class="flex-none">
				<SettingsTabs :tabs="tabs"/>
			</div>
                        <div class="flex-grow p-6 min-h-full">
                                <div class="bg-neutral-800 w-full h-full p-10">
                                <div>{{ currentActiveTab }}</div>
                                <div> asasfmwkmwafvev</div>
                                </div>
                        </div>
		</div>
	</div>
</template>

<script setup>
const tabs = ["Tab 1", "Tab 2", "Tab 3", "Tab 4", "Tab 5"];
const currentActiveTab = useState("currentActiveSettingsTab", () => tabs[0]);



</script>
