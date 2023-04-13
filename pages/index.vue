<template>
	<div class="pb-10 px-10 pt-8 max-w-7xl w-full">
		<div
			v-if="
				currentActive &&
				currentActive.id === 'MasterInput'
			"
			:class="`fixed z-50 h-11 w-2 bg-[#3992FF] transition-all duration-100 ease-linear`"
			:style="`left: ${cursorLeft - 4}px; top: ${
				cursorTop - 2
			}px`"
		></div>
		<div class="flex justify-center">
			<div
				class="bg-neutral-900 mb-8 px-6 py-2 h-14 rounded-[20px] text-xs items-center flex justify-between relative w-[80%]"
			>
				<div class="flex gap-3 items-center col-span-2">
					<div>Difficulty:</div>
					<div class="relative">
						<select
							class="text-base relative w-32 rounded-xl bg-neutral-800 hover:bg-neutral-700 transition-all cursor-pointer py-2 pl-[10px] pr-10 text-left focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm"
						>
							<option
								v-for="key in difficulty"
								:value="key"
							>
								{{ key }}
							</option>
						</select>
						<span
							class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"
						>
							<Icon
								name="heroicons:chevron-down-20-solid"
								size="1rem"
							/>
						</span>
					</div>
				</div>
				<div class="flex gap-3 items-center col-span-2">
					<div>Mode:</div>
					<div class="relative">
						<select
							class="text-base relative w-32 rounded-xl bg-neutral-800 hover:bg-neutral-700 transition-all cursor-pointer py-2 pl-[10px] pr-10 text-left focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm"
						>
							<option
								v-for="key in modes"
								:value="key"
							>
								{{ key }}
							</option>
						</select>
						<span
							class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"
						>
							<Icon
								name="heroicons:chevron-down-20-solid"
								size="1rem"
							/>
						</span>
					</div>
				</div>
				<div class="flex gap-3 items-center col-span-2">
					<div>Keys:</div>
					<div class="relative">
						<select
							@change="
								(e) =>
									fetchData(
										e
											.target
											.value
									)
							"
							class="text-base relative w-32 rounded-xl bg-neutral-800 hover:bg-neutral-700 transition-all cursor-pointer py-2 pl-[10px] pr-10 text-left focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm"
						>
							<option
								value=""
								disabled
								selected
							>
								Any key
							</option>
							<option
								v-for="key in keyOptions"
								:value="key"
							>
								{{
									key.toUpperCase()
								}}
							</option>
						</select>
						<span
							class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"
						>
							<Icon
								name="heroicons:chevron-down-20-solid"
								size="1rem"
							/>
						</span>
					</div>
				</div>
				<div
					class="col-span-2 flex gap-3 items-center justify-end"
				>
					<Modal />
					<button
						class="text-sm pl-3 pr-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 transition-all cursor-pointer"
						@click="isOpen = !isOpen"
					>
						<Icon
							name="heroicons:cog-6-tooth"
							class="mr-2"
							size="1rem"
						/>
						<span>More settings</span>
					</button>
				</div>
			</div>
		</div>
		<div
			@click.prevent.stop="
				currentActive &&
				currentActive.id === 'MasterInput'
					? ''
					: focusInput()
			"
			:class="`font-mono relative transition-all ease-linear duration-1000 mb-6 min-h-[16rem] bg-neutral-900/80 pt-3 pb-6 px-6 rounded-[32px] w-full text-4xl leading-[54px]`"
		>
			<template v-for="(word, index) in allData">
				<span :class="``"
					><span
						v-for="(
							char, charIndex
						) in word.characters"
						:class="` ${
							char.status ===
							'correct'
								? 'opacity-100'
								: char.status ===
								  'extra'
								? 'bg-[#F44250] text-white opacity-100'
								: char.status ===
								  'error'
								? 'text-[#F44250] opacity-100'
								: char.status ===
										'error' &&
								  char.character ===
										' '
								? 'bg-red-600'
								: 'opacity-50'
						} ${
							index ===
								currentWordNum &&
							charIndex ===
								currentPendingWordIndex
								? 'cursor-key'
								: ''
						}`"
						>{{
							char.character === " "
								? " "
								: char.character
						}}</span
					></span
				>
			</template>
			<div
				v-if="
					!currentActive ||
					(currentActive &&
						currentActive.id !==
							'MasterInput')
				"
				@click="
					!allData.length
						? fetchData(currentChar)
						: ''
				"
				class="inset-0 absolute right-0 items-center justify-center flex cursor-pointer backdrop-blur rounded-[32px]"
			>
				<div
					class="text-neutral-300 pointer-events-none text-2xl"
				>
					click to activate
				</div>
			</div>
		</div>
		<input
			type="text"
			id="MasterInput"
			@keydown="handleKeydown"
			style="opacity: 0%; position: absolute"
		/>
		<div class="grid grid-cols-10 gap-x-8">
			<div class="col-span-5 flex flex-col gap-5 py-4">
				<div class="font-semibold text-xl">
					Latest sessions
				</div>
				<div
					class="flex flex-col gap-3 max-h-96 overflow-scroll"
				>
					<div
						v-if="!totalTime.length"
						class="text-sm text-neutral-400 border border-neutral-700 px-4 py-5 text-center"
					>
						Your past games will show up
						here!
					</div>
					<div
						v-for="(
							game, index
						) in totalTime"
						class="border-neutral-700 border px-4 py-2 flex gap-2 align-top"
					>
						<div class="flex-grow">
							<div>Name</div>
							<div
								class="text-sm text-neutral-400"
							>
								Rating country
							</div>
						</div>
						<div class="w-20">
							<p
								class="text-neutral-300 text-sm leading-4"
							>
								wpm
							</p>
							<p
								class="text-xl font-medium"
							>
								{{
									totalTime[
										totalTime.length -
											1 -
											index
									].toFixed(
										1
									)
								}}
							</p>
						</div>
						<div class="w-20">
							<p
								class="text-neutral-300 text-sm leading-4"
							>
								acc
							</p>
							<p
								class="text-xl font-medium"
							>
								{{
									accArr[
										totalTime.length -
											index -
											1
									].toFixed(
										1
									)
								}}
							</p>
						</div>
					</div>
				</div>
			</div>
			<div class="col-span-5 grid grid-cols-10">
				<div
					class="col-span-2 row-span-2 grid pt-4 pb-4"
				>
					<div>
						<div
							class="text-3xl mb-1 text-neutral-400"
						>
							wpm
						</div>
						<div
							class="text-4xl text-[#3DEFE9]"
						>
							{{
								totalTime.length
									? totalTime[
											totalTime.length -
												1
									  ].toFixed(
											2
									  )
									: "0.00"
							}}
						</div>
					</div>
					<div>
						<div
							class="text-3xl mb-1 text-neutral-400"
						>
							acc
						</div>
						<div
							class="text-4xl text-[#3DEFE9]"
						>
							{{
								accArr.length
									? accArr[
											accArr.length -
												1
									  ].toFixed(
											2
									  )
									: "0.00"
							}}
						</div>
					</div>
				</div>
				<div class="col-span-8 row-span-2 -mb-4">
					<ClientOnly>
						<Chart
							:data="
								sortedDatasetData
							"
							:columns="sortedColumns"
						/>
					</ClientOnly>
					<!--<div class="border border-neutral-700 rounded-lg bg-neutral-900 h-96 overflow-scroll relative text-sm"><div class="grid grid-cols-6 py-4 px-6 border-b border-neutral-700 sticky top-0 bg-neutral-800/50 backdrop-blur-md"><div class="col-span-3">Character</div> <div class="col-span-1">Timing</div> <div class="col-span-2 text-right">Status</div></div><div v-for="data,index in flatData" class="grid grid-cols-6 py-4 px-8 odd:bg-neutral-800/30"><div class="col-span-1">{{ index+1 }}</div><div class="col-span-2">{{ data.character }}</div><div  class="col-span-1">{{ data.timing }}</div><div class="col-span-2 text-right">{{ data.status }}</div></div></div>-->
				</div>
				<div class="col-span-2">
					<div class="text-neutral-400">
						test type
					</div>
					<p class="text-2xl">
						{{
							currentChar
								? `char ${currentChar}`
								: "all key"
						}}
					</p>
				</div>
				<div class="col-span-2">
					<div class="text-neutral-400">raw</div>
					<p class="text-2xl">0</p>
				</div>
				<div class="col-span-2">
					<div class="text-neutral-400">
						characters
					</div>
					<p class="text-2xl">
						{{
							accuracies
								? accuracies.total_chars
								: 0
						}}/{{
							accuracies
								? accuracies.error_chars
								: 0
						}}/{{ 
							numberOfExtras
						 }}
					</p>
				</div>
				<div class="col-span-2">
					<div class="text-neutral-400">
						consistencies
					</div>
					<p class="text-2xl">0</p>
				</div>
				<div class="col-span-2">
					<div class="text-neutral-400">time</div>
					<p class="text-2xl">
						{{
							accuracies
								? accuracies.total_time
								: "0.00"
						}}
					</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { insertSessions } from "../utils/db/sessions";
const user = useSupabaseUser();
const router = useRouter();

const startTime = ref(0);
const endTime = ref(0);
const numberOfExtras = ref(0);
const allWords = ref([]);
const outputData = computed(() => {
	return {
		start_time: startTime.value,
		end_time: endTime.value,
		chars: accuracies.value.total_chars,
		errors: accuracies.value.error_chars,
		extras: numberOfExtras.value,
		words: allWords.value,
		char_performance: sortedDataset.value,
	};
});

const pastSessions = ref([]);
const difficulty = ["Easy", "Medium", "Hard"];
const modes = ["Word", "Time", "Code"];
const isOpen = useState("isOpen", () => false);
const currentActive = ref();
const loading = ref(false);
const currentChar = ref("");
const allData = ref([]);
const currentWordNum = ref(0);
const currentCharNum = ref(0);
const currentPendingWordIndex = ref(0);
const currentIncorrect = ref(false);
const cursorLeft = ref(0);
const cursorTop = ref(0);
const totalTime = ref([]);
const flatData = computed(() => {
	return allData.value.flatMap((data) => {
		return data.characters;
	});
});
const accuracies = computed(() => {
	let initialValue = 0;
	let total_chars = 0;
	let correct_chars = 0;
	let error_chars = 0;
	const arr = allData.value.flatMap((data) => {
		return data.characters;
	});
	for (const d of arr) {
		initialValue += d.timing;
		d.status === "error"
			? error_chars++
			: d.status === "correct"
			? correct_chars++
			: "";
		total_chars++;
	}
	return {
		total_time: parseFloat(initialValue.toFixed(2)),
		total_chars,
		correct_chars,
		error_chars,
	};
});
const accArr = ref([]);
const keyOptions = [
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
	" ",
];
const datasetObject = ref([
	{ char: "a", count: 0, value: 0, totalValue: 0 },
	{ char: "b", count: 0, value: 0, totalValue: 0 },
	{ char: "c", count: 0, value: 0, totalValue: 0 },
	{ char: "d", count: 0, value: 0, totalValue: 0 },
	{ char: "e", count: 0, value: 0, totalValue: 0 },
	{ char: "f", count: 0, value: 0, totalValue: 0 },
	{ char: "g", count: 0, value: 0, totalValue: 0 },
	{ char: "h", count: 0, value: 0, totalValue: 0 },
	{ char: "i", count: 0, value: 0, totalValue: 0 },
	{ char: "j", count: 0, value: 0, totalValue: 0 },
	{ char: "k", count: 0, value: 0, totalValue: 0 },
	{ char: "l", count: 0, value: 0, totalValue: 0 },
	{ char: "m", count: 0, value: 0, totalValue: 0 },
	{ char: "n", count: 0, value: 0, totalValue: 0 },
	{ char: "o", count: 0, value: 0, totalValue: 0 },
	{ char: "p", count: 0, value: 0, totalValue: 0 },
	{ char: "q", count: 0, value: 0, totalValue: 0 },
	{ char: "r", count: 0, value: 0, totalValue: 0 },
	{ char: "s", count: 0, value: 0, totalValue: 0 },
	{ char: "t", count: 0, value: 0, totalValue: 0 },
	{ char: "u", count: 0, value: 0, totalValue: 0 },
	{ char: "v", count: 0, value: 0, totalValue: 0 },
	{ char: "w", count: 0, value: 0, totalValue: 0 },
	{ char: "x", count: 0, value: 0, totalValue: 0 },
	{ char: "y", count: 0, value: 0, totalValue: 0 },
	{ char: "z", count: 0, value: 0, totalValue: 0 },
	{ char: " ", count: 0, value: 0, totalValue: 0 },
]);
const sortedDataset = computed(() => {
	return datasetObject.value
		.filter((i) => i.count > 0)
		.sort((x, y) => {
			return y.value - x.value;
		});
});
const sortedDatasetData = computed(() => {
	return sortedDataset.value.flatMap((data) => {
		return calculateWPM(data.value);
	});
});
function calculateWPM(time: number) {
	const charactersPerWord = 5;
	const wpm = 60 / charactersPerWord / time;
	return wpm;
}

const sortedColumns = computed(() => {
	return sortedDataset.value.flatMap((data) => {
		return data.char;
	});
});

const {
	data: words,
	refresh,
	pending,
	error,
} = await useAsyncData("words", async () => {
	const { data } = await useFetch("api/words");
	return data.value;
});

async function fetchData(char = "") {
	loading.value = true;
	currentChar.value = char.charAt(0);
	resetIndexes();
	const { data } = await useFetch(
		`api/words?char=${currentChar.value.charAt(0)}`
	);
	words.value = data.value;
	fillData();
	focusInput();
	loading.value = false;
}

function fillData() {
	allData.value = [];
	allWords.value = [];
	if (words.value) {
		allWords.value = words.value.all_words;
		let wordCount = 0;
		for (const word of words.value.all_words) {
			const characters = word.split("");
			const charData = [];
			let charCount = 0;
			for (const char of characters) {
				charData.push({
					character: char,
					timing: 0,
					status: "pending",
					char_index: charCount,
					word_index: wordCount,
				});
				charCount++;
			}
			allData.value.push({
				word: word,
				characters: charData,
				index: wordCount,
				type: "word",
			});
			if (wordCount !== words.value.all_words.length - 1) {
				allData.value.push({
					word: " ",
					characters: [
						{
							character: " ",
							timing: 0,
							status: "pending",
							char_index: 0,
							word_index: wordCount,
						},
					],
					index: wordCount,
					type: "separator",
				});
			}
			wordCount++;
		}
	}
}

function resetIndexes() {
	fillData();
	currentWordNum.value = 0;
	currentCharNum.value = 0;
	numberOfExtras.value = 0;
	currentPendingWordIndex.value = 0;
}

watch(currentActive, () => {
	if (currentActive.value.id !== "MasterInput") {
		resetIndexes();
	}
});

function focusInput() {
	document.getElementById("MasterInput").focus();
}

let finalKeydown = Date.now();

function handleBackspace() {
	if (
		allData.value.length &&
		allData.value[currentWordNum.value].characters[
			currentPendingWordIndex.value - 1
		].status === "extra"
	) {
		allData.value[currentWordNum.value].characters.splice(
			currentPendingWordIndex.value - 1,
			1
		);
		currentPendingWordIndex.value--;
	}
}

const isRestrictedKeys = (e: KeyboardEvent) => {
	if (
		(e.keyCode >= 9 && e.keyCode <= 27) ||
		(e.keyCode >= 33 && e.keyCode <= 45) ||
		(e.keyCode >= 91 && e.keyCode <= 93) ||
		(e.keyCode >= 112 && e.keyCode <= 183)
	) {
		return true;
	}
	return false;
};

const isBackspace = (e: KeyboardEvent) => {
	if (e.keyCode == 8 || e.keyCode === 46) {
		return true;
	}
	return false;
};

const isStartSession = (
	currentWordLocation: number,
	currentCharLocation: number
) => {
	if (currentWordLocation === 0 && currentCharLocation === 0) {
		return true;
	}
	return false;
};

const isEndSession = (
	currentWordLocation: number,
	currentCharLocation: number,
	totalWords: number,
	currentWordLength: number
) => {
	if (
		currentWordLocation === totalWords - 1 &&
		currentCharLocation === currentWordLength - 1
	) {
		return true;
	}
	return false;
};

const isStartWord = (currentCharLocation: number) => {
	if (currentCharLocation === 0) {
		return true;
	}
	return false;
};

const isEndWord = (currentCharLocation: number, currentWordLength: number) => {
	if (currentCharLocation === currentWordLength - 1) {
		return true;
	}
	return false;
};

function handleKeydown(e: KeyboardEvent) {
	e.preventDefault();
	e.stopImmediatePropagation();
	const key = e.key;
	//handle unexpected erros
	if (loading.value || !allData.value.length) {
		return;
	}
	if (key === "Enter") {
		fetchData();
	} else if (isBackspace(e)) {
		handleBackspace();
	} else if (isRestrictedKeys(e)) {
		console.log(key);
	} else {
		const time = Date.now();
		const currentWordLocation = currentWordNum.value;
		const currentWordMetadata = allData.value[currentWordLocation];
		const currentWord = "";
		const currentCharLocation = currentCharNum.value;
		const currentCharMetadata =
			allData.value[currentWordLocation].characters[
				currentCharLocation
			];
		const currentChar = currentCharMetadata?.character;
		const totalWords = allData.value.length;
		const currentWordLength =
			allData.value[currentWordLocation].characters.length;
		const currentCorrectCharWordLocation = 0;
		const currentCorrectCharLocation =
			currentPendingWordIndex.value;
		const currentCorrectChar =
			allData.value[currentWordLocation].characters[
				currentCorrectCharLocation
			]?.character;
		const allowSkipExtras = true;
		const isNoneExtra = () => {
			if (
				currentCharLocation ===
				currentCorrectCharLocation
			) {
				return true;
			}
			return false;
		};
		if (key === currentCorrectChar) {
			let currentObj =
				allData.value[currentWordLocation].characters[
					currentCharLocation
				];
			if (allowSkipExtras) {
				function deleteExtras() {
					let totalExtras =
						currentCorrectCharLocation -
						currentCharLocation;
					allData.value[
						currentWordLocation
					].characters.splice(
						currentCharLocation,
						totalExtras
					);
				}
				deleteExtras();
				currentObj =
					allData.value[currentWordLocation]
						.characters[
						currentCharLocation
					];
				if (!isNoneExtra() || currentIncorrect.value) {
					currentObj.status = "error";
					currentIncorrect.value = false;
				} else {
					currentObj.status = "correct";
				}
				const currCharObj = datasetObject.value.find(
					(i) => i.char === e.key
				);
				currCharObj.count++;
				currCharObj.totalValue += parseFloat(
					((time - finalKeydown) / 1000).toFixed(
						2
					)
				);
				currCharObj.value = parseFloat(
					(
						currCharObj.totalValue /
						currCharObj.count
					).toFixed(2)
				);
			}
			if (
				isStartSession(
					currentWordLocation,
					currentCharLocation
				)
			) {
				startTime.value = Date.now();
				currentObj.timing = 0;
			} else {
				currentObj.timing =
					(time - finalKeydown) / 1000;
			}
			if (
				isEndSession(
					currentWordLocation,
					currentCharLocation,
					totalWords,
					currentWordLength
				)
			) {
				
				const timeTaken = parseFloat(
						(
							25 /
							((time -
								startTime.value) /
								1000 /
								60)
						).toFixed(2)
					)
				totalTime.value.push(timeTaken);
				accArr.value.push(
					parseFloat(
						(
							(accuracies.value
								.correct_chars /
								accuracies.value
									.total_chars) *
							100
						).toFixed(2)
					)
				);
				outputData.value.wpm = calculateWPM(timeTaken)
				pastSessions.value.push(
					JSON.parse(
						JSON.stringify(outputData.value)
					)
				);
				fetchData(currentChar.value);
			} else if (
				isEndWord(
					currentCorrectCharLocation,
					currentWordLength
				)
			) {
				currentWordNum.value++;
				currentCharNum.value = 0;
			} else currentCharNum.value++;
			currentPendingWordIndex.value = currentCharNum.value;
		}
		// handle incorrect keys
		else {
			currentIncorrect.value = true;
			allData.value[currentWordNum.value].characters.splice(
				currentPendingWordIndex.value,
				0,
				{ character: e.key, timing: 0, status: "extra" }
			);
			numberOfExtras.value++;
			currentPendingWordIndex.value++;
		}
		finalKeydown = time;
	}
}

function getGameData() {
	const data = "";
	return data;
}

function handleStartSession() {
	const gameData = getGameData();
}

function handleLeaveSession() {}

function handleStartWord() {}

function handleEndWord() {}

function handleAfk() {}

onMounted(() => {
	function getCursorPosition() {
		const cursorKey = document.querySelector(".cursor-key");
		if (cursorKey?.getBoundingClientRect()) {
			const rect = cursorKey?.getBoundingClientRect();

			cursorLeft.value = parseFloat(rect.left);
			cursorTop.value = parseFloat(rect.top);
			currentActive.value = document.activeElement;
		}
		requestAnimationFrame(getCursorPosition);
	}

	requestAnimationFrame(getCursorPosition);
});
</script>
