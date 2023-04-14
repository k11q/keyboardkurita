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
							v-model="
								selectedDifficulty
							"
							@change="
								(e) => {
									selectedDifficulty =
										e
											.target
											.value;
									fetchData(
										selectedKey
									);
								}
							"
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
								(e) => {
									selectedKey =
										e
											.target
											.value;
									fetchData(
										e
											.target
											.value
									);
								}
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
			<div
				class="rounded-xl bg-neutral-900 w-[70%] overflow-clip mt-6"
			>
				<div
					class="justify-between px-6 py-4 even:bg-neutral-800 grid grid-cols-10 text-sm text-neutral-400"
				>
					<div class="col-span-2">
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
					<div class="col-span-2">
						<div>date</div>
					</div>
				</div>
				<div
					v-for="session in pastSessions
						.slice()
						.reverse()"
					class="justify-between px-6 py-4 even:bg-neutral-800 grid grid-cols-10"
				>
					<div class="col-span-2">
						<div>
							{{
								session.user_username
							}}
						</div>
					</div>
					<div>
						<div>{{ session.wpm }}</div>
					</div>
					<div>
						<div>{{ session.raw }}</div>
					</div>
					<div>
						<div>
							{{ session.accuracy }}
						</div>
					</div>
					<div>
						<div>
							{{
								session.consistency
							}}
						</div>
					</div>
					<div>
						<div>
							{{
								session.total_corrects
							}}/{{
								session.total_errors
							}}/{{
								session.total_extras
							}}/{{
								session.total_missed
							}}
						</div>
					</div>
					<div>
						<div>{{ session.mode }}</div>
					</div>
					<div class="col-span-2">
						<div>
							{{
								formatDistanceToNow(
									new Date(
										session.end_time
									)
								)
							}}
						</div>
					</div>
				</div>
			</div>
		</div>
		<!--<div>{{ pastSessions }}</div>-->
	</div>
</template>

<script setup lang="ts">
import type { SessionsInsert } from "../utils/db/sessions";
import { formatDistanceToNow } from "date-fns";

//types
type DifficultyOptions = "easy" | "medium" | "hard" | "extra_hard";
type ModesOptions = "word" | "time";
type ConfigDurationOptions = 10 | 20 | 30 | 60 | undefined;
type ConfigTotalWordsOptions = 10 | 25 | 50 | undefined;
type ConfigSelectionOptions = "english_50k" | "supabase-docs" | "supabase code";

//db & auth
const user = useSupabaseUser();
const client = useSupabaseClient();

// readonly
const DIFFICULTY: DifficultyOptions[] = [
	"easy",
	"medium",
	"hard",
	"extra_hard",
];
const MODES: ModesOptions[] = ["word", "time"];
const SELECTION: ConfigSelectionOptions[] = [
	"english_50k",
	"supabase-docs",
	"supabase code",
];
const PROFILE = ref();
const USERNAME: globalThis.Ref<string> = computed(() => {
	return PROFILE.value ? PROFILE.value.username : "username";
});

// game settings
const selectedDuration: globalThis.Ref<ConfigDurationOptions> = ref(undefined);
const selectedWords: globalThis.Ref<ConfigTotalWordsOptions> = ref(10);
const selectedDifficulty: globalThis.Ref<DifficultyOptions> = ref("easy");
const selectedMode: globalThis.Ref<ModesOptions> = ref("word");
const selectedKey = ref("");
let selectedSelection: ConfigSelectionOptions = "english_50k";

// local settings
let maxExtraWords: number | undefined = undefined;
let allowSkipWords = false;
let allowSkipExtras = true;
let skipIncorrectWords = false;
let forgiveSkipCharacters = false;

// display
let showLiveWPM = false;
let showTimerProgress = false;
let punctuation = false;
let numbers = false;

// collected data, we use this to pass to the final object before inserting to db
let startTime: number | undefined = undefined;
let endTime: number | undefined = undefined;
let sessionRunning = ref(false);
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
//final object to insert to db
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

// variable for logging wpm and row in interval
let charactersPerThreeSecondCount = 0;
let intervalCount = 1;

// miscs
let timeoutId;
const pastSessions: SessionsInsert[] = ref([]);
const isOpen = useState("isOpen", () => false);
const currentActive = ref();
const loading = ref(false);
const currentChar = ref("");
const allData = ref([]);
const currentWordNum = ref(0);
const currentCharNum = ref(0);
const currentPendingWordIndex = ref(0);
const words = ref();
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

async function fetchData(char = "") {
	loading.value = true;
	currentChar.value = char.charAt(0);
	resetIndexes();
	resetAllSessionData();
	const { data } = await useFetch(
		`api/words?char=${selectedKey.value.charAt(0)}&difficulty=${
			selectedDifficulty.value
		}`
	);
	words.value = data.value;
	fillData();
	focusInput();
	loading.value = false;
}

function fillData() {
	allData.value = [];
	if (words.value) {
		let wordCount = 0;
		for (const word of words.value.all_words) {
			const characters = word.split("");
			const charData = [];
			let charCount = 0;
			// create char object
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
			// push word object
			allData.value.push({
				word: word,
				characters: charData,
				index: wordCount,
				type: "word",
			});
			// push separator object
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

let finalKeydown = Date.now();

function handleKeydown(e: KeyboardEvent) {
	e.preventDefault();
	e.stopImmediatePropagation();
	//handle unexpected erros
	if (loading.value || !allData.value.length) {
		return;
	}
	const key = e.key;
	// tab used to start new game
	if (key === "Tab") {
		fetchData();
	}
	//else if (key === "Enter") {fetchData();}
	else if (isBackspace(e)) {
		handleBackspace();
	} else if (isRestrictedKeys(e)) {
		console.log(key);
	} else {
		const time = Date.now();
		const currentWordLocation = currentWordNum.value;
		const currentWordMetadata = allData.value[currentWordLocation];
		if (
			currentWordMetadata &&
			currentWordMetadata.type !== "separator"
		) {
			totalCharacters++;
		}
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
		let currentIncorrect = false;
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
			deleteExtras();
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
			if (allowSkipExtras) {
				currentObj =
					allData.value[currentWordLocation]
						.characters[
						currentCharLocation
					];
				// handle incorrect
				if (!isNoneExtra() || currentIncorrect) {
					currentObj.status = "error";
					currentIncorrect = false;
				} else {
					if (
						currentWordMetadata &&
						currentWordMetadata.type !==
							"separator"
					) {
						totalCorrects++;
					}
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
			if (
				isEndSession(
					currentWordLocation,
					currentCharLocation,
					totalWords,
					currentWordLength
				)
			) {
				const calculatedWPM = parseFloat(
					(
						Math.round(totalCorrects / 5) /
						((time - startTime) / 1000 / 60)
					).toFixed(2)
				);
				let acc = parseFloat(
					(
						(totalCorrects /
							totalCharacters) *
						100
					).toFixed(2)
				);
				accuracy = acc;
				raw = parseFloat(
					(
						Math.round(
							(totalCharacters +
								totalExtras) /
								5
						) /
						((time - startTime) / 1000 / 60)
					).toFixed(2)
				);
				wpm = calculatedWPM;
				consistency = parseFloat(
					((wpm / raw) * 100).toFixed(2)
				);
				handleEndSession();
				pastSessions.value.push(
					JSON.parse(
						JSON.stringify(
							sessionsInsertData
						)
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
		}
		// handle incorrect keys
		else {
			handleIncorrectInput();
		}

		function handleIncorrectInput() {
			if (!currentIncorrect) {
				totalErrors++;
			}
			currentIncorrect = true;
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
}

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

function handleStartSession(
	mode: string,
	difficulty: string,
	game_metadata: {}
) {
	sessionRunning.value = true;
	resetInterval();
	timeoutId = setTimeout(updateWPM, 1000);
	resetAllSessionData();
	fillData();
	fillInitialData(mode, difficulty, game_metadata);
}

function fillInitialData(mode: string, difficulty: string, game_metadata: {}) {
	sessionsInsertData.user_username = USERNAME.value;
	sessionsInsertData.user_id = PROFILE.value?.id;
	sessionsInsertData.start_time = new Date()
		.toISOString()
		.toLocaleString("ms-MY");
	sessionsInsertData.mode = mode;
	sessionsInsertData.difficulty = difficulty;
	sessionsInsertData.game_metadata = game_metadata;
}

function handleEndSession() {
	endTime = Date.now();
	fillFinalData();
	sessionRunning.value = false;
}

function handleEndWord(word: string, type: "separator" | "word") {
	type === "word" ? collectedWords.push(word) : undefined;
}

function handleLeaveSession() {}

function handleAfkOrOutOfFocus() {
	resetAllSessionData();
	resetIndexes();
	fillData();
	sessionRunning.value = false;
}

function resetAllSessionData() {
	startTime = undefined;
	endTime = undefined;
	wpm = 0;
	cpm = 0;
	raw = 0;
	accuracy = 0;
	consistency = 0;
	totalCorrects = 0;
	totalErrors = 0;
	totalExtras = 0;
	totalMissed: 0;
	totalCharacters = 0;
	totalWords = 0;
	collectedWords = [];
}

function resetIndexes() {
	currentWordNum.value = 0;
	currentCharNum.value = 0;
	totalExtras = 0;
	currentPendingWordIndex.value = 0;
}

//db insert
function fillFinalData() {
	sessionsInsertData.end_time = new Date()
		.toISOString()
		.toLocaleString("ms-MY", {});
	sessionsInsertData.duration = (endTime - startTime) / 1000 / 60;
	sessionsInsertData.words = collectedWords;
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

// interval to get wpm at realtime
function resetInterval() {
	if (timeoutId) {
		clearTimeout(timeoutId);
		intervalCount = 1;
	}
}

// Call the function initially to start the loop
function updateWPM() {
	if (!sessionRunning.value) {
		clearTimeout(timeoutId);
		intervalCount = 1;
		return;
	}
	if (startTime === null) {
		startTime = Date.now();
	}
	const elapsedTime = Date.now() - startTime;

	const wpm = parseFloat(
		calculateWPM(totalCorrects, elapsedTime).toFixed(2)
	);
	const rawWPM = parseFloat(
		calculateRawWPM(totalCharacters, elapsedTime).toFixed(2)
	);

	console.log(
		"Second: ",
		intervalCount,
		"Raw WPM: ",
		rawWPM,
		"WPM: ",
		wpm
	);
	intervalCount++;

	timeoutId = setTimeout(updateWPM, 1000); // Log the values every second
}

//watch if input out of focus
watch(currentActive, () => {
	if (currentActive.value.id !== "MasterInput") {
		handleAfkOrOutOfFocus();
	}
});

//manage carot
const CAROTLEFT = ref(0);
const CAROTTOP = ref(0);

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
		getProfile();

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
	}
});

// pure functions and checkers
function getWords(mode: string, words: string[], logs: []) {
	return mode === "word" ? words : undefined;
}

function getDuration(mode: string, words: string[], logs: []) {
	return mode === "time" ? words : undefined;
}

function isRestrictedKeys(e: KeyboardEvent) {
	return (
		(e.keyCode >= 9 && e.keyCode <= 27) ||
		(e.keyCode >= 33 && e.keyCode <= 45) ||
		(e.keyCode >= 91 && e.keyCode <= 93) ||
		(e.keyCode >= 112 && e.keyCode <= 183)
	);
}

function isBackspace(e: KeyboardEvent) {
	return e.keyCode == 8 || e.keyCode === 46;
}

function isStartSession(
	currentWordLocation: number,
	currentCharLocation: number
) {
	return currentWordLocation === 0 && currentCharLocation === 0;
}

function isEndSession(
	currentWordLocation: number,
	currentCharLocation: number,
	totalWords: number,
	currentWordLength: number
) {
	return (
		currentWordLocation === totalWords - 1 &&
		currentCharLocation === currentWordLength - 1
	);
}

function isEndWord(currentCharLocation: number, currentWordLength: number) {
	return currentCharLocation === currentWordLength - 1;
}

// utils
function focusInput() {
	document.getElementById("MasterInput").focus();
}

function calculateWPM(correctChars, elapsedTime) {
	const words = correctChars / 5;
	const minutes = elapsedTime / 1000 / 60;
	return words / minutes;
}

function calculateRawWPM(totalChars, elapsedTime) {
	const words = totalChars / 5;
	const minutes = elapsedTime / 1000 / 60;
	return words / minutes;
}
</script>
