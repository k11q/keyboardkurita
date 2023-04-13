<template>
	<HeadlessTransitionRoot appear :show="isOpen" as="template">
		<HeadlessDialog as="div" @close="closeModal" class="relative z-10">
			<HeadlessTransitionChild
				as="template"
				enter="duration-300 ease-out"
				enter-from="opacity-0"
				enter-to="opacity-100"
				leave="duration-200 ease-in"
				leave-from="opacity-100"
				leave-to="opacity-0"
			>
				<div
					class="fixed inset-0 bg-neutral-600 bg-opacity-25 backdrop-blur-sm"
				/>
			</HeadlessTransitionChild>

			<div class="fixed inset-0 overflow-y-auto">
				<div
					class="flex min-h-full items-center justify-center p-4 text-center"
				>
					<HeadlessTransitionChild
						as="template"
						enter="duration-300 ease-out"
						enter-from="opacity-0 scale-95"
						enter-to="opacity-100 scale-100"
						leave="duration-200 ease-in"
						leave-from="opacity-100 scale-100"
						leave-to="opacity-0 scale-95"
					>
						<HeadlessDialogPanel
							class="flex flex-col gap-2 w-full max-w-xl transform overflow-hidden rounded-2xl bg-neutral-900 px-6 pb-6 pt-8 text-left align-middle border border-neutral-700 transition-all text-white"
						>
						<h1 class="text-2xl font-semibold mb-2">Settings</h1>
						<div class="flex gap-3 mb-3 shadow-[0_-2px_0_inset] shadow-neutral-700"><button v-for="tab in tabs" @click="currentTab = tab" :class="`${currentTab === tab? 'shadow-[0_-2px_0_inset] shadow-green-500' : 'text-neutral-400 hover:text-white'} py-3 px-2`">{{tab}}</button></div>
						<div class="flex flex-col gap-4 text-neutral-200">
							<div class="flex justify-between">
								<div>Space to skip word</div>
								<UISwitch />
							</div>
							<div class="flex justify-between">
								<div>Cursor stop at error</div>
								<UISwitch />
							</div>
							<div class="flex justify-between">
								<div>Allow skip characters</div>
								<UISwitch />
							</div>
							<div class="flex justify-between">
								<div>Forgive extra characters</div>
								<UISwitch />
							</div>
						</div>
						</HeadlessDialogPanel>
					</HeadlessTransitionChild>
				</div>
			</div>
		</HeadlessDialog>
	</HeadlessTransitionRoot>
</template>

<script setup>
const isOpen = useState('isOpen');

function closeModal() {
	isOpen.value = false;
}
function openModal() {
	isOpen.value = true;
}

const tabs = ['Game', 'Keyboard', 'Style']
const currentTab = ref(tabs[0])
</script>
