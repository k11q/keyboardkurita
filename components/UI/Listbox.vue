<template>
	<HeadlessListbox v-model="selectedItem">
		<div class="relative">
			<HeadlessListboxButton
				class="relative w-32 rounded-xl bg-neutral-800 py-2 pl-[10px] pr-10 text-left focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm"
			>
				<span class="block truncate">{{
					selectedItem
				}}</span>
				<span
					class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"
				>
					<Icon
						name="heroicons:chevron-down-20-solid"
					/>
				</span>
			</HeadlessListboxButton>

			<transition
				leave-active-class="transition duration-100 ease-in"
				leave-from-class="opacity-100"
				leave-to-class="opacity-0"
			>
				<HeadlessListboxOptions
					class="z-10 absolute mt-1 max-h-60 w-full overflow-auto rounded-xl bg-neutral-800 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
				>
					<HeadlessListboxOption
						v-slot="{ active, selected }"
						v-for="person in props.difficulty"
						:key="person"
						:value="person"
						as="template"
					>
						<li
							:class="`${
								active
									? 'bg-amber-100 text-amber-900'
									: ''
							} ${selected ? 'text-neutral-300' : ''} relative cursor-default select-none py-2 pl-4 pr-4`"
						>
							<span
								:class="[
									selected
										? 'font-medium'
										: 'font-normal',
									'block truncate',
								]"
								>{{
									person
								}}</span
							>
						</li>
					</HeadlessListboxOption>
				</HeadlessListboxOptions>
			</transition>
		</div>
	</HeadlessListbox>
</template>

<script setup>
const props = defineProps({
        difficulty: Array
})
const selectedItem = ref('')
onMounted(()=>{
        selectedItem.value = props.difficulty[0]
})

</script>
