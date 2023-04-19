<template>
	<HeadlessTransitionRoot
		appear
		:show="isOpen"
		as="template"
	>
		<HeadlessDialog
			as="div"
			class="relative z-40"
			@close="closeModal"
		>
			<HeadlessTransitionChild
				as="template"
				enter="duration-200 ease-out"
				enter-from="opacity-0"
				enter-to="opacity-100"
				leave="duration-100 ease-in"
				leave-from="opacity-100"
				leave-to="opacity-0"
			>
				<div
					class="fixed inset-0 bg-neutral-900 bg-opacity-30 backdrop-blur-sm"
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
							class="flex flex-col w-full max-w-3xl h-[560px] transform overflow-hidden rounded-3xl bg-neutral-900/80 backdrop-blur-md text-left align-middle border border-neutral-700 text-white"
						>
							<div>Setup your username</div>
						</HeadlessDialogPanel>
					</HeadlessTransitionChild>
				</div>
			</div>
		</HeadlessDialog>
	</HeadlessTransitionRoot>
</template>

<script setup>
const isOpen = useState('setUsernameModal', ()=>true);

function closeModal() {
	isOpen.value = false;
}
function openModal() {
	isOpen.value = true;
}

</script>
