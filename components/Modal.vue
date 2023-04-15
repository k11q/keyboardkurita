<template>
	<HeadlessTransitionRoot appear :show="isOpen" as="template">
		<HeadlessDialog
			as="div"
			@close="closeModal"
			class="relative z-10"
		>
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
							<div
								class="px-6 flex justify-between items-center py-4 bg-neutral-800/10"
							>
								<div>
									<h1
										class="text-xl font-medium font-mono"
									>
										Settings
									</h1>
									<p
										class="text-neutral-500 leading-4 text-sm"
									>
										Configure
										your
										typing
										experience.
									</p>
								</div>
								<button
									class="text-neutral-600 h-9 w-9 flex items-center justify-center rounded-lg bg-neutral-800/30 hover:bg-neutral-700/30 hover:text-neutral-300 transition-all duration-75"
									@click="
										isOpen = false
									"
								>
									<Icon
										name="heroicons:x-mark"
										size="1.5rem"
									/>
								</button>
							</div>

							<div
								class="flex justify-evenly bg-neutral-800/20"
							>
								<button
									v-for="tab in tabs"
									@click="
										currentTab =
											tab.tab
									"
									:class="`${
										currentTab ===
										tab.tab
											? 'border-y border-t-[#6BD968] border-b-neutral-800/50 bg-neutral-700/20 border-x first:border-l-0 last:border-r-0 border-neutral-700 text-[#6BD968]'
											: 'border-y border-t-neutral-700/40 border-b-neutral-700 text-neutral-400 hover:text-white hover:bg-neutral-800/20 transition-opacity'
									} py-2.5 px-2 flex-grow`"
								>
									{{
										tab.tab
									}}
								</button>
							</div>
							<div
								class="flex flex-col flex-grow overflow-y-auto text-neutral-200 bg-neutral-800/50"
							>
								<div
									v-for="setting in tabs.find(
										(
											i
										) =>
											i.tab ===
											currentTab
									)
										.settings"
									class="flex items-center justify-between gap-6 odd:bg-neutral-900/40 pl-6 pr-2.5 h-16 flex-none"
								>
									<div>
										<div
											class=""
										>
											{{
												setting.title
											}}
										</div>
										<div
											class="text-xs leading-4 text-neutral-500 line-clamp"
											v-if="
												setting.description
											"
										>
											{{
												setting.description
											}}
										</div>
									</div>
									<div
										:class="`relative flex justify-evenly min-w-[300px] p-0.5 gap-0.5 rounded-xl text-sm font-medium bg-neutral-900/90`"
									>
										<button
											v-if="
												setting.type ===
												'tab'
											"
											v-for="option in setting.option"
											:class="`rounded-[10px] px-3 py-1 flex-grow text-center ${
												option ===
												setting.selected
													? 'bg-neutral-700/50 text-[#6BD968] border border-neutral-700'
													: 'hover:bg-neutral-800/60 text-neutral-500'
											}`"
											@click="
												setting.selected =
													option
											"
										>
											{{
												option
											}}
										</button>
										<select
											v-if="
												setting.type ===
												'select'
											"
											class="rounded-[10px] px-3 py-1 flex-grow text-center bg-neutral-700/50 text-[#6BD968] border border-neutral-700 focus:ring-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6BD968]/70"
										>
											<option
												v-for="option in setting.option"
												:value="
													option
												"
											>
												{{
													option
												}}
											</option>
										</select>
										<span
											v-if="
												setting.type ===
												'select'
											"
											class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 text-neutral-500"
										>
											<Icon
												name="heroicons:chevron-down-20-solid"
												size="1.25rem"
											/>
										</span>
									</div>
									<!-- <UISwitch /> -->
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
const isOpen = useState("isOpen");

function closeModal() {
	isOpen.value = false;
}
function openModal() {
	isOpen.value = true;
}

const tabs = ref([
	{
		tab: "Game",
		settings: [
			{
				title: "Difficulty",
				description:
					"Sets the difficulty of the selected words",
				selected: "easy",
				option: [
					"easy",
					"medium",
					"hard",
					"extra hard",
				],
				type: "tab",
			},

			{
				title: "Mode",
				description:
					"The mode of the tests. Word means you will be tested within a duration, word means you will be tested a certain number of words.",
				selected: "word",
				option: ["time", "word"],
				type: "tab",
			},
			{
				title: "Total words",
				description:
					"Number of words that you will be tested.",
				selected: 10,
				option: [10, 25, 50, 100],
				type: "tab",
			},
			{
				title: "Duration",
				description: "The duration of the tests.",
				selected: 10,
				option: [10, 20, 30, 60],
				type: "tab",
			},
			{
				title: "Dataset",
				description:
					"The source of the words that are selected.",
				selected: "english_5k",
				option: ["english_5k", "english_50k", "code"],
				type: "select",
			},
			{
				title: "Key",
				description:
					"Select a key to prioritize. If a value is selected, each selected words will contain the selected key.",
				selected: "none",
				option: [
					"none",
					"a",
					"b",
					"c",
					"d",
					"e",
					"f",
					"g",
					"h",
					"i",
					"j",
					"k",
					"l",
					"m",
					"n",
					"o",
					"p",
					"q",
					"r",
					"s",
					"t",
					"u",
					"v",
					"w",
					"x",
					"y",
					"z",
				],
				type: "select",
			},
			{
				title: "Max errors",
				description:
					"Restrict number of errors and reset the session when reached the maximum number of errors.",
				selected: "off",
				option: ["on", "off"],
				type: "tab",
			},
		],
	},
	{
		tab: "Input",
		settings: [
			{
				title: "Space to skip word",
				description:
					"This enables using space to skip the words.",
				selected: "off",
				option: ["on", "off"],
				type: "tab",
			},
			{
				title: "Cursor stop at error",
				description:
					"Cursor will stop at error until you enter the correct character.",
				selected: "off",
				option: ["on", "off"],
				type: "tab",
			},
			{
				title: "Allow skip characters",
				description:
					"Incorrect input will skip the character and move to the next.",
				selected: "off",
				option: ["on", "off"],
				type: "tab",
			},
			{
				title: "Forgive extra characters",
				description:
					"This enables using space to skip the words.",
				selected: "off",
				option: ["on", "off"],
				type: "tab",
			},
		],
	},
	{
		tab: "Keyboard",
		settings: [
			{
				title: "Space to skip word",
				description:
					"This enables using space to skip the words.",
				selected: "off",
				option: ["on", "off"],
				type: "tab",
			},
			{
				title: "Cursor stop at error",
				description:
					"Cursor will stop at error until you enter the correct character.",
				selected: "off",
				option: ["on", "off"],
				type: "tab",
			},
			{
				title: "Allow skip characters",
				description:
					"Incorrect input will skip the character and move to the next.",
				selected: "off",
				option: ["on", "off"],
				type: "tab",
			},
			{
				title: "Forgive extra characters",
				description:
					"This enables using space to skip the words.",
				selected: "off",
				option: ["on", "off"],
				type: "tab",
			},
		],
	},
	{
		tab: "Style",
		settings: [
			{
				title: "Set carot style",
				description:
					"This enables using space to skip the words.",
				selected: "on",
				option: ["on", "off", "off", "off"],
				type: "tab",
			},
			{
				title: "Set spacer style",
				description:
					"Cursor will stop at error until you enter the correct character.",
				selected: "off",
				option: ["on", "off"],
				type: "tab",
			},
			{
				title: "Set font size",
				description:
					"Incorrect input will skip the character and move to the next.",
				selected: "off",
				option: ["on", "off"],
				type: "tab",
			},
			{
				title: "Set font",
				description:
					"This enables using space to skip the words.",
				selected: "off",
				option: ["on", "off"],
				type: "tab",
			},
		],
	},
]);
const gameSettings = ref([
	{
		title: "Space to skip word",
		selected: "off",
		option: ["on", "off"],
	},
	{
		title: "Cursor stop at error",
		selected: "off",
		option: ["on", "off"],
	},
	{
		title: "Allow skip characters",
		selected: "off",
		option: ["on", "off"],
	},
	{
		title: "Forgive extra characters",
		selected: "off",
		option: ["on", "off"],
	},
]);

const currentTab = ref("Game");
</script>
