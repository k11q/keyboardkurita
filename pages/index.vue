<template>
	<div class="pb-10 px-10 pt-8 max-w-7xl w-full">
	<!--
		<div
			class="flex mb-8 shadow-sm w-fit max-w-full overflow-scroll"
		>
			<button
				:class="`h-9 hover:bg-neutral-700 hover:text-white/90 font-medium border-y border-r px-3 border-neutral-400 flex-none flex items-center justify-center first:border-l first:rounded-l last:rounded-r ${
					!currentChar
						? 'bg-neutral-600 text-white'
						: 'text-white/60'
				}`"
				@click="fetchData('')"
			>
				All key
			</button>
			<button
				v-for="i in 26"
				:class="`hover:bg-neutral-700 hover:text-white/90 font-medium border-y border-r h-9 w-9 border-neutral-400 flex-none flex items-center justify-center first:border-l first:rounded-l last:rounded-r ${
					currentChar ===
					String.fromCharCode(i + 96)
						? 'bg-neutral-600 text-white'
						: 'text-white/60'
				}`"
				@click="
					(e) => {
						fetchData(
							e.target.textContent.toLowerCase()
						);
					}
				"
			>
				{{ String.fromCharCode(i + 64) }}
			</button>
		</div>
		-->
		<div
			v-if="
				currentActive &&
				currentActive.id === 'MasterInput'
			"
			:class="`fixed z-50 h-11 w-2 bg-[#3992FF] transition-all duration-100 ease-linear`"
			:style="`left: ${cursorLeft - 6}px; top: ${
				cursorTop + 8
			}px`"
		></div>
		<div class="flex justify-center">
		<div class="bg-neutral-900 mb-8 px-6 py-2 h-14 rounded-[20px] text-xs items-center grid grid-cols-7 relative w-[80%]"><div class="flex gap-3 items-center col-span-2"><div>Difficulty:</div><UIListbox :difficulty="difficulty"/></div><div class="flex gap-3 items-center col-span-2"><div>Mode:</div><UIListbox :difficulty="modes"/></div><div class="flex gap-3 items-center col-span-2"><div>Keys:</div><UIListbox :difficulty="keyOptions"/></div><div class="flex gap-3 items-center justify-end"><button class="text-sm">More settings</button></div></div>
	</div>
		<div
			@click.prevent.stop="
				currentActive &&
				currentActive.id === 'MasterInput'
					? ''
					: focusInput()
			"
			:class="`relative transition-all ease-linear duration-1000 mb-6 min-h-[16rem] bg-neutral-900/80 pt-3 pb-6 px-6 rounded-[32px] w-full text-5xl leading-[54px]`"
		>
			<template v-for="(word, index) in allData">
				<span
					:class="` pointer-events-none ease-linear transition-opacity duration-1000 tracking-wide ${
						index === currentWordNum &&
						separator
							? 'relative'
							: ''
					}`"
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
								: 'opacity-50'
						} ${
							index ===
								currentWordNum &&
							charIndex ===
								currentPendingWordIndex &&
							!separator
								? 'cursor-key'
								: ''
						}`"
						>{{
							char.character === " "
								? "\&nbsp"
								: char.character
						}}</span
					>
					<span
						:class="`tracking-widest ${
							index ===
								currentWordNum -
									1 &&
							separator
								? 'cursor-key'
								: ''
						}`"
						>{{ " " }}</span
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
				class="inset-0 absolute right-0 items-center justify-center flex cursor-pointer backdrop-blur rounded-[32px] "
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
			@keydown="watchKeydown"
			style="opacity: 0%; position: absolute"
		/>
		<div class="grid grid-cols-10 gap-x-8">
			<div class="col-span-2 flex flex-col gap-5 py-4">
				<div class="font-semibold text-xl">
					All games
				</div>
				<div
					class="flex flex-col gap-3 max-h-96 overflow-scroll"
				>
					<div
						v-if="!totalTime.length"
						class="text-sm text-neutral-400 border border-neutral-700 px-4 py-2 text-center"
					>
						Your past games will show up
						here!
					</div>
					<div
						v-for="(
							game, index
						) in totalTime"
						class="border-neutral-700 border px-4 py-2 grid grid-cols-2 gap-x-2 align-top"
					>
						<div class="">
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
						<div class="">
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
			<div class="col-span-8 grid grid-cols-10">
				<div
					class="col-span-2 grid row-span-2 pt-4 pb-4"
				>
					<div>
						<div
							class="text-4xl mb-1 text-neutral-400"
						>
							wpm
						</div>
						<div
							class="text-5xl text-[#3DEFE9]"
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
							class="text-4xl mb-1 text-neutral-400"
						>
							acc
						</div>
						<div
							class="text-5xl text-[#3DEFE9]"
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
					<p class="text-3xl">
						{{
							currentChar
								? `char ${currentChar}`
								: "all key"
						}}
					</p>
				</div>
				<div class="col-span-2">
					<div class="text-neutral-400">raw</div>
					<p class="text-3xl">0</p>
				</div>
				<div class="col-span-2">
					<div class="text-neutral-400">
						characters
					</div>
					<p class="text-3xl">
						{{
							accuracies
								? accuracies.total_chars
								: 0
						}}/{{
							accuracies
								? accuracies.error_chars
								: 0
						}}
					</p>
				</div>
				<div class="col-span-2">
					<div class="text-neutral-400">
						consistencies
					</div>
					<p class="text-3xl">0</p>
				</div>
				<div class="col-span-2">
					<div class="text-neutral-400">time</div>
					<p class="text-3xl">
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

<script setup>
const difficulty = ['Easy', 'Medium', 'Hard'];
const modes = ['Word', 'Time', 'Code'];
const keyOptions = ['Any key', 'A', 'B'];
const isOpen = useState("isOpen", () => false);
const currentActive = ref();
const loading = ref(false);
const model = ref("");
const typedData = ref([]);
const wordsData = ref([]);
const currentChar = ref("");
const allData = ref([]);
const currentWordNum = ref(0);
const currentCharNum = ref(0);
const currentPendingWordIndex = ref(0);
const separator = ref(false);
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
const startingTime = ref(0);
const columns = [
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
]);
const dataset = computed(() => {
	return datasetObject.value.flatMap((data) => {
		return data.value;
	});
});

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

function calculateWPM(time) {
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
	currentChar.value = char.charAt(0);
	resetIndexes();
	const { data } = await useFetch(
		`api/words?char=${currentChar.value.charAt(0)}`
	);
	words.value = data.value;
	fillData();
	focusInput();
}

function fillData() {
	allData.value = [];
	if (words.value) {
		words.value.all_words.map((i) => {
			const characters = i.split("");
			const charData = [];
			for (const char of characters) {
				charData.push({
					character: char,
					timing: 0,
					status: "pending",
				});
			}

			allData.value.push({ word: i, characters: charData });
		});
	}
}

function resetIndexes() {
	fillData();
	typedData.value = [];
	currentWordNum.value = 0;
	currentCharNum.value = 0;
	currentPendingWordIndex.value = 0;
	separator.value = false;
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

function watchKeydown(e) {
	e.preventDefault();
	e.stopImmediatePropagation();
	if (e.key === "Enter") {
		typedData.value = [];
		fetchData();
	} else if (e.keyCode === 8 || e.keyCode === 46) {
		if (typedData.value.length) {
			typedData.value.pop();
		}
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
	} else if (
		(e.keyCode >= 9 && e.keyCode <= 27) ||
		(e.keyCode >= 91 && e.keyCode <= 93) ||
		(e.keyCode >= 112 && e.keyCode <= 183)
	) {
		console.log(e.key);
	} else {
		let key = e.key;
		const time = Date.now();
		typedData.value.length ? "" : (startingTime.value = time);
		typedData.value = [
			...typedData.value,
			{
				key: key,
				time: time,
				time_taken: typedData.value.length
					? (time - finalKeydown) / 1000
					: 0,
			},
		];
		console.log(e.key);
		if (separator.value && e.key === " ") {
			separator.value = !separator.value;
		} else if (
			allData.value.length &&
			allData.value[currentWordNum.value].characters[
				currentPendingWordIndex.value
			].character === e.key &&
			!separator.value
		) {
			function deleteExtras() {
				let totalExtras =
					currentPendingWordIndex.value -
					currentCharNum.value;
				allData.value[
					currentWordNum.value
				].characters.splice(
					currentCharNum.value,
					totalExtras
				);
			}
			deleteExtras();
			const currentObj =
				allData.value[currentWordNum.value].characters[
					currentCharNum.value
				];
			if (
				currentPendingWordIndex.value !=
					currentCharNum.value ||
				currentIncorrect.value
			) {
				currentObj.status = "error";
				currentIncorrect.value = false;
			} else {
				currentObj.status = "correct";
			}
			const currCharObj = datasetObject.value.find(
				(i) => i.char === e.key
			);
			currCharObj.count++;
			currCharObj.totalValue += (time - finalKeydown) / 1000;
			currCharObj.value =
				currCharObj.totalValue / currCharObj.count;
			currentObj.timing =
				currentWordNum.value + currentCharNum.value == 0
					? 0
					: (time - finalKeydown) / 1000;
			if (
				allData.value.length ===
					currentWordNum.value + 1 &&
				allData.value[currentWordNum.value].characters
					.length ===
					currentCharNum.value + 1
			) {
				totalTime.value.push(
					parseFloat(
						(
							25 /
							((time -
								startingTime.value) /
								1000 /
								60)
						).toFixed(2)
					)
				);
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
				fetchData(currentChar.value);
			} else if (
				allData.value[currentWordNum.value].characters
					.length ===
				currentCharNum.value + 1
			) {
				currentWordNum.value++;
				currentCharNum.value = 0;
				separator.value = true;
			} else currentCharNum.value++;
			currentPendingWordIndex.value = currentCharNum.value;
		} else if (allData.value.length) {
			currentIncorrect.value = true;
			allData.value[currentWordNum.value].characters.splice(
				currentPendingWordIndex.value,
				0,
				{ character: e.key, timing: 0, status: "extra" }
			);
			currentPendingWordIndex.value++;
		}
		finalKeydown = time;
	}
}

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
