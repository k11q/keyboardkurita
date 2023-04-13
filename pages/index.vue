<template>
	<div class="pb-10 px-10 pt-8 max-w-7xl w-full">
		<div
			v-if="
				currentActive &&
				currentActive.id === 'MasterInput'
			"
			:class="`fixed z-50 h-11 w-2 bg-[#3992FF] transition-all duration-100 ease-linear`"
			:style="`left: ${CAROTLEFT - 4}px; top: ${
				CAROTTOP - 2
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
								v-for="key in DIFFICULTY"
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
								v-for="key in MODES"
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
		<div class="flex justify-center">
		<div class="rounded-xl bg-neutral-900 w-[70%] overflow-clip">
			<div
				class="flex justify-between px-6 py-4 even:bg-neutral-800"
			>
				<div>
					<div>username</div>
				</div>
				<div>
					<div>wpm</div>
				</div>
				<div>
					<div>raw</div>
				</div>
				<div>
					<div>acc</div>
				</div>
				<div>
					<div>consistency</div>
				</div>
				<div>
					<div>chars</div>
				</div>
				<div>
					<div>mode</div>
				</div>
				<div>
					<div>info</div>
				</div>
				<div>
					<div>tags</div>
				</div>
				<div>
					<div>date</div>
				</div>
			</div>
			<div
				v-for="session in pastSessions
					.slice()
					.reverse()"
				class="flex justify-between px-6 py-4 even:bg-neutral-800"
			>
				<div>
					<div>{{ session.user_username }}</div>
				</div>
				<div>
					<div>{{ session.wpm }}</div>
				</div>
				<div>
					<div>{{ session.raw }}</div>
				</div>
				<div>
					<div>{{ session.accuracy }}</div>
				</div>
				<div>
					<div>{{ session.consistency }}</div>
				</div>
				<div>
					<div>
						{{ session.total_corrects }}/{{
							session.total_errors
						}}/{{ session.total_extras }}/{{
							session.total_missed
						}}
					</div>
				</div>
				<div>
					<div>{{ session.mode }}</div>
				</div>
				<div>
					<div>wpm</div>
				</div>
				<div>
					<div>wpm</div>
				</div>
				<div>
					<div>{{ session.end_time }}</div>
				</div>
			</div>
		</div>
		</div>
		<!--<div>{{ pastSessions }}</div>-->
	</div>
</template>

<script setup lang="ts">
import type { SessionsInsert } from "../utils/db/sessions";

const user = useSupabaseUser();
const client = useSupabaseClient();
// readonly
const DIFFICULTY = ["Easy", "Medium", "Hard"];
const MODES = ["Word", "Time", "Code"];
const PROFILE = ref();
const USERNAME = computed(() => {
	return PROFILE.value? PROFILE.value.username : 'username';
});
//only change in one place
const CAROTLEFT = ref(0);
const CAROTTOP = ref(0);

// game config
const configDuration = ref(0);
const configTotalWords = ref(25);
const selectedDifficulty = ref("Easy");
const selectedMode = ref("Word");

let startTime = Date.now();
let endTime = Date.now();
const allWords = ref([]);
let wpm = 0;
let cpm = 0;
let raw = 0;
let accuracy = 0;
let consistency = 0;
let totalCorrects = 0;
let totalErrors = 0;
let totalExtras = 0;
let totalMissed: 0;
let totalCharacters = 0;
let totalWords = 0;
let collectedWords: string[] = [];
const sessionsInsertData: SessionsInsert = {
	//required
	user_username: "",
	user_id: 0,
	//insert at start
	start_time: "",
	difficulty: "",
	mode: "",
	game_metadata: {},
	//insert at end
	end_time: "",
	duration: 0, //selected/calculated
	wpm: 0,
	cpm: 0,
	accuracy: 0,
	consistency: 0,
	raw: 0,
	total_corrects: 0,
	total_errors: 0,
	total_extras: 0,
	total_missed: 0,
	total_characters: 0, //selected/calculated
	total_words: 0,
	words: [], //selected/calculated
	char_performance: [],
	word_performance: [],
	interval_performance: [],
	keystroke_logs: [],
	logs: [],
};
// start data, filled at start of session
const outputData = computed((): SessionsInsert => {
	return {
		accuracy: accuracy,
		user_username: USERNAME.value,
		start_time: new Date(startTime)
			.toISOString()
			.toLocaleString("ms-MY"),
		end_time: new Date(endTime)
			.toISOString()
			.toLocaleString("ms-MY"),
		words: allWords.value,
		char_performance: sortedDataset.value,
		duration: configDuration.value,
		logs: allData.value,
		wpm: wpm,
		cpm: 0,
		consistency: 0,
		difficulty: selectedDifficulty.value,
		mode: selectedMode.value,
		raw: raw,
		total_characters: accuracies.value.total_chars,
		total_corrects:
			accuracies.value.total_chars -
			accuracies.value.error_chars,
		total_errors: accuracies.value.error_chars,
		total_extras: totalExtras,
		total_missed: 0,
	};
});

const pastSessions: SessionsInsert[] = ref([]);
const isOpen = useState("isOpen", () => false);
const currentActive = ref();
const loading = ref(false);
const currentChar = ref("");
const allData = ref([]);
const currentWordNum = ref(0);
const currentCharNum = ref(0);
const currentPendingWordIndex = ref(0);
const currentIncorrect = ref(false);
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
	{ char: "a", count: 0, value: 0, totalValue: 0, wpm: 0 },
	{ char: "b", count: 0, value: 0, totalValue: 0, wpm: 0 },
	{ char: "c", count: 0, value: 0, totalValue: 0, wpm: 0 },
	{ char: "d", count: 0, value: 0, totalValue: 0, wpm: 0 },
	{ char: "e", count: 0, value: 0, totalValue: 0, wpm: 0 },
	{ char: "f", count: 0, value: 0, totalValue: 0, wpm: 0 },
	{ char: "g", count: 0, value: 0, totalValue: 0, wpm: 0 },
	{ char: "h", count: 0, value: 0, totalValue: 0, wpm: 0 },
	{ char: "i", count: 0, value: 0, totalValue: 0, wpm: 0 },
	{ char: "j", count: 0, value: 0, totalValue: 0, wpm: 0 },
	{ char: "k", count: 0, value: 0, totalValue: 0, wpm: 0 },
	{ char: "l", count: 0, value: 0, totalValue: 0, wpm: 0 },
	{ char: "m", count: 0, value: 0, totalValue: 0, wpm: 0 },
	{ char: "n", count: 0, value: 0, totalValue: 0, wpm: 0 },
	{ char: "o", count: 0, value: 0, totalValue: 0, wpm: 0 },
	{ char: "p", count: 0, value: 0, totalValue: 0, wpm: 0 },
	{ char: "q", count: 0, value: 0, totalValue: 0, wpm: 0 },
	{ char: "r", count: 0, value: 0, totalValue: 0, wpm: 0 },
	{ char: "s", count: 0, value: 0, totalValue: 0, wpm: 0 },
	{ char: "t", count: 0, value: 0, totalValue: 0, wpm: 0 },
	{ char: "u", count: 0, value: 0, totalValue: 0, wpm: 0 },
	{ char: "v", count: 0, value: 0, totalValue: 0, wpm: 0 },
	{ char: "w", count: 0, value: 0, totalValue: 0, wpm: 0 },
	{ char: "x", count: 0, value: 0, totalValue: 0, wpm: 0 },
	{ char: "y", count: 0, value: 0, totalValue: 0, wpm: 0 },
	{ char: "z", count: 0, value: 0, totalValue: 0, wpm: 0 },
	{ char: " ", count: 0, value: 0, totalValue: 0, wpm: 0 },
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
	function calculateWPM(time: number) {
		const charactersPerWord = 5;
		const wpm = 60 / charactersPerWord / time;
		return wpm;
	}
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
	totalExtras = 0;
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

		function handleBackspace() {
			if (
				allData.value.length &&
				allData.value[currentWordNum.value].characters[
					currentPendingWordIndex.value - 1
				].status === "extra"
			) {
				allData.value[
					currentWordNum.value
				].characters.splice(
					currentPendingWordIndex.value - 1,
					1
				);
				currentPendingWordIndex.value--;
			}
		}
	} else if (isRestrictedKeys(e)) {
		console.log(key);
	} else {
		const time = Date.now();
		const currentWordLocation = currentWordNum.value;
		const currentWordMetadata = allData.value[currentWordLocation];
		const currentWord = allData.value[currentWordLocation]?.word;
		const currentCharLocation = currentCharNum.value;
		const currentCharMetadata =
			allData.value[currentWordLocation]?.characters[
				currentCharLocation
			];
		const currentChar = currentCharMetadata?.character;
		totalWords = allData.value.length;
		const currentWordLength =
			allData.value[currentWordLocation]?.characters.length;
		const currentCorrectCharWordLocation = 0;
		const currentCorrectCharLocation =
			currentPendingWordIndex.value;
		const currentCorrectChar =
			allData.value[currentWordLocation]?.characters[
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
					totalCorrects++;
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
			}
			if (
				isStartSession(
					currentWordLocation,
					currentCharLocation
				)
			) {
				handleStartSession(
					selectedMode.value,
					selectedDifficulty.value,
					{}
				);
				startTime = Date.now();
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
						Math.round(
							accuracies.value
								.total_chars / 5
						) /
						((time - startTime) / 1000 / 60)
					).toFixed(2)
				);
				let acc = parseFloat(
					(
						(accuracies.value
							.correct_chars /
							accuracies.value
								.total_chars) *
						100
					).toFixed(2)
				);
				accuracy = acc;
				raw = parseFloat(
					(
						Math.round(
							(accuracies.value
								.total_chars +
								totalExtras) /
								5
						) /
						((time - startTime) / 1000 / 60)
					).toFixed(2)
				);
				wpm = timeTaken;
				consistency = parseFloat((wpm/raw*100).toFixed(2))
				handleEndSession();
				pastSessions.value.push(
					JSON.parse(
						JSON.stringify(sessionsInsertData)
					)
				);
				fetchData(currentChar.value);
			} else if (
				isEndWord(
					currentCorrectCharLocation,
					currentWordLength
				)
			) {
				handleEndWord(
					currentWord,
					currentWordMetadata.type
				);
				currentWordNum.value++;
				currentCharNum.value = 0;
			} else currentCharNum.value++;
			currentPendingWordIndex.value = currentCharNum.value;

			function isStartSession(
				currentWordLocation: number,
				currentCharLocation: number
			) {
				if (
					currentWordLocation === 0 &&
					currentCharLocation === 0
				) {
					return true;
				}
				return false;
			}

			function isEndSession(
				currentWordLocation: number,
				currentCharLocation: number,
				totalWords: number,
				currentWordLength: number
			) {
				if (
					currentWordLocation ===
						totalWords - 1 &&
					currentCharLocation ===
						currentWordLength - 1
				) {
					return true;
				}
				return false;
			}

			function isEndWord(
				currentCharLocation: number,
				currentWordLength: number
			) {
				if (
					currentCharLocation ===
					currentWordLength - 1
				) {
					return true;
				}
				return false;
			}

			function handleStartSession(
				mode: string,
				difficulty: string,
				game_metadata: {}
			) {
				resetSessionData()
				fillInitialData(
					mode,
					difficulty,
					game_metadata
				);

				function fillInitialData(
					mode: string,
					difficulty: string,
					game_metadata: {}
				) {
					sessionsInsertData.user_username =
						USERNAME.value;
					sessionsInsertData.user_id =
						PROFILE.value?.id;
					sessionsInsertData.start_time =
						new Date()
							.toISOString()
							.toLocaleString(
								"ms-MY"
							);
					sessionsInsertData.mode = mode;
					sessionsInsertData.difficulty =
						difficulty;
					sessionsInsertData.game_metadata =
						game_metadata;
				}
			}

			function resetSessionData(){
				collectedWords = [];
				totalCharacters = 0;
				totalCorrects = 0;
				totalErrors = 0;
				totalWords = 0;
				totalExtras = 0;
				totalMissed = 0;
				wpm = 0;
				cpm = 0;
				raw = 0;
				accuracy = 0;
				consistency = 0;
			}

			function handleEndSession() {
				fillFinalData();
				//insertSessionToDatabase();

				function fillFinalData() {
					sessionsInsertData.end_time = new Date()
						.toISOString()
						.toLocaleString("ms-MY", {});
					sessionsInsertData.duration = 0;
					sessionsInsertData.words =
						collectedWords;
					sessionsInsertData.total_characters = totalCharacters;
					sessionsInsertData.total_corrects = totalCorrects;
					sessionsInsertData.total_errors = totalErrors;
					sessionsInsertData.total_words = totalWords;
					sessionsInsertData.total_extras = totalExtras;
					sessionsInsertData.total_missed = totalMissed;
					sessionsInsertData.wpm = wpm;
					sessionsInsertData.cpm = cpm;
					sessionsInsertData.raw = raw;
					sessionsInsertData.accuracy = accuracy;
					sessionsInsertData.consistency = consistency;
				}

				function getWords(
					mode: string,
					words: string[],
					logs: []
				) {
					if (mode === "Words") {
						return words;
					} else {
					}
				}

				function getDuration(
					mode: string,
					words: string[],
					logs: []
				) {
					if (mode === "time") {
						return words;
					} else {
					}
				}

				async function insertSessionToDatabase() {
					const { data, error } = await client
						.from("sessions")
						.insert(sessionsInsertData);
					if (error) {
						console.log(error);
						return error;
					}
					console.log(data);
					return data;
				}
			}

			function handleEndWord(
				word: string,
				type: "separator" | "word"
			) {
				if (type === "word") {
					collectedWords.push(word);
				}
			}
		}
		// handle incorrect keys
		else {
			handleIncorrectInput();
		}

		function handleIncorrectInput() {
			if(!currentIncorrect.value){
				totalErrors++
			}
			currentIncorrect.value = true;
			allData.value[currentWordNum.value].characters.splice(
				currentPendingWordIndex.value,
				0,
				{ character: e.key, timing: 0, status: "extra" }
			);
			totalExtras++;
			currentPendingWordIndex.value++;
		}
		finalKeydown = time;
	}
	function isRestrictedKeys(e: KeyboardEvent) {
		if (
			(e.keyCode >= 9 && e.keyCode <= 27) ||
			(e.keyCode >= 33 && e.keyCode <= 45) ||
			(e.keyCode >= 91 && e.keyCode <= 93) ||
			(e.keyCode >= 112 && e.keyCode <= 183)
		) {
			return true;
		}
		return false;
	}

	function isBackspace(e: KeyboardEvent) {
		if (e.keyCode == 8 || e.keyCode === 46) {
			return true;
		}
		return false;
	}
}

function handleLeaveSession() {}

function handleAfk() {}

//manage carot
onMounted(() => {
	function setCarotPosition() {
		const cursorKey = document.querySelector(".cursor-key");
		if (cursorKey?.getBoundingClientRect()) {
			const rect = cursorKey?.getBoundingClientRect();

			CAROTLEFT.value = parseFloat(rect.left);
			CAROTTOP.value = parseFloat(rect.top);
			currentActive.value = document.activeElement;
		}
		requestAnimationFrame(setCarotPosition);
	}

	requestAnimationFrame(setCarotPosition);
});

// get profile data from auth
watchEffect(() => {
	if (user.value) {
		async function getProfile() {
			const { data, error } = await client
				.from("profile")
				.select()
				.eq("user_id", user.value.id)
				.single();
			if (error) {
				console.log(error);
			}
			PROFILE.value = data;
		}
		getProfile();
	}
});
</script>
