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
				class="bg-neutral-900 mb-5 px-6 py-2 h-14 rounded-[20px] text-xs items-center flex justify-between relative w-[80%]"
			>
				<div class="flex gap-3 items-center col-span-2">
					<div>Difficulty:</div>
					<div class="relative">
						<select
							:value="
								selectedDifficulty
							"
							@change="
								updateDifficultyAndFetch(
									$event
								)
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
							v-model="selectedMode"
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
								updateKeyAndFetch(
									$event
								)
							"
							:value="selectedKey"
							class="text-base relative w-32 rounded-xl bg-neutral-800 hover:bg-neutral-700 transition-all cursor-pointer py-2 pl-[10px] pr-10 text-left focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm"
						>
							<option
								v-for="key in KEYOPTIONS"
								:value="key"
							>
								{{
									key === "" ? "Any key" : key.toUpperCase()
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
		<div class="flex justify-center mb-5">
			<div
				class="grid grid-cols-3 gap-4 [&>*]:flex [&>*]:flex-col [&>*]:items-center min-w-[340px]"
			>
				<div>
					<div class="text-neutral-500 text-sm">
						time
					</div>
					<div
						class="text-3xl font-medium font-mono text-[#FECC1B]"
					>
						{{ liveTimer }}
					</div>
				</div>
				<div>
					<div class="text-neutral-500 text-sm">
						wpm
					</div>
					<div
						class="text-3xl font-medium font-mono text-[#6BD968]"
					>
						{{ liveWpm.toFixed(1) }}
					</div>
				</div>
				<div>
					<div class="text-neutral-500 text-sm">
						raw
					</div>
					<div
						class="text-3xl font-medium font-mono text-[#3DEFE9]"
					>
						{{ liveRawWpm.toFixed(1) }}
					</div>
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
						? fetchWords(currentKey)
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
				class="rounded-lg border border-neutral-800 w-[80%] overflow-clip mt-6"
			>
				<div
					class="justify-between px-6 py-4 grid grid-cols-10 text-sm text-neutral-400 bg-neutral-900"
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
					v-for="session in [
						...pastSessions
							.slice()
							.reverse(),
					].slice(0, 5)"
					class="justify-between px-6 py-4 border-t bg-neutral-800/40 border-neutral-800 grid grid-cols-10"
				>
					<div class="col-span-2">
						<div>
							{{
								session.user_username
							}}
						</div>
					</div>
					<div>
						<div class="text-[#6BD968]">
							{{
								session.wpm.toFixed(
									1
								)
							}}
						</div>
					</div>
					<div>
						<div class="tabular-nums">
							{{
								session.raw.toFixed(
									1
								)
							}}
						</div>
					</div>
					<div>
						<div class="tabular-nums">
							{{
								session.accuracy.toFixed(
									1
								)
							}}
						</div>
					</div>
					<div>
						<div class="tabular-nums">
							{{
								session.consistency.toFixed(
									1
								)
							}}
						</div>
					</div>
					<div>
						<div class="tabular-nums">
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
						<div class="tabular-nums">
							{{
								format(
									new Date(
										session.end_time
									),
									"Pp"
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
import { useHomeStore } from "@/stores/home";
import type { SessionsInsert } from "../utils/db/sessions";
import { format } from "date-fns";
import { storeToRefs } from "pinia";
import type {
	DifficultyOptions,
	ModesOptions,
	ConfigDurationOptions,
	ConfigTotalWordsOptions,
	ConfigSelectionOptions,
	CharLogStatus,
} from "@/stores/home";

//types
type KeystrokeLog = { character: string; time: number; status: CharLogStatus };
type WordType = "separator" | "word";
type CharacterMetadata = {
	character: string;
	timing: number;
	status: CharLogStatus;
	char_index: number;
	word_index: number;
};
type WordMetadata = {
	word: string;
	characters: CharacterMetadata[];
	type: WordType;
	index: number;
};

//db & auth
const user = useSupabaseUser();
const client = useSupabaseClient();

const store = useHomeStore();

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
const KEYOPTIONS = [
	"",
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
const PROFILE = ref();
const USERNAME: globalThis.Ref<string> = computed(() => {
	return PROFILE.value ? PROFILE.value.username : "username";
});

// game settings
const {
	difficulty: selectedDifficulty,
	duration: selectedDuration,
	words: selectedWords,
	mode: selectedMode,
	key: selectedKey,
	dataset: selectedSelection,
	maxExtraWords,
	allowSkipExtras,
	allowSkipWords,
	skipIncorrectWords,
	forgiveSkipCharacters,
	showLiveWPM,
	showTimerProgress,
	punctuation,
	numbers,
} = storeToRefs(store);

// collected data, we use this to pass to the final object before inserting to db
let sessionRunning = ref(false);
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
	xp_gains: 0,
	//optional
	multiplayer_id: undefined,
};

// variable for logging wpm and row in interval
let charactersPerThreeSecondCount = 0;
let intervalCount = 1;
const liveWpm = ref(0);
const liveRawWpm = ref(0);
const liveTimer = ref(0);

const currentActive = ref();
const allData: globalThis.Ref<WordMetadata[]> = ref([]);
const currentWordNum = ref(0);
const currentCharNum = ref(0);
const currentPendingWordIndex = ref(0);
const words = ref();
let startTime: number;
let endTime: number;
let currentIncorrect = false;
let finalKeydown = Date.now();

// ui states
const isOpen = useState("isOpen", () => false);
const loading = ref(false);

//temporary placeholder for db
const pastSessions: globalThis.Ref<SessionsInsert[]> = ref([]);

// miscs
let timeoutId;

async function fetchWords(char = "") {
	loading.value = true;
	if (char) {
		selectedKey.value = char.charAt(0);
	}
	resetIndexes();
	resetAllSessionData();
	if (words.value && words.value.next_data) {
		words.value = words.value.next_data;
		setupData();
		words.value.next_data = await fetchAndReturn();
	} else {
		words.value = await fetchAndReturn();
		setupData();
	}

	function setupData() {
		fillData();
		focusInput();
		loading.value = false;
	}

	async function fetchAndReturn() {
		const { data } = await useFetch(
			`api/words?char=${selectedKey.value.charAt(
				0
			)}&difficulty=${selectedDifficulty.value}`
		);
		return data.value;
	}
}

async function fetchFreshWords(char = "") {
	loading.value = true;
	if (char) {
		selectedKey.value = char.charAt(0);
	}
	resetIndexes();
	resetAllSessionData();
	words.value = await fetchAndReturn();
	fillData();
	focusInput();
	loading.value = false;

	async function fetchAndReturn() {
		const { data } = await useFetch(
			`api/words?char=${selectedKey.value.charAt(
				0
			)}&difficulty=${selectedDifficulty.value}`
		);
		return data.value;
	}
}

function fillData() {
	allData.value = [];
	if (!words.value) {
		console.log("Error: no words found to fill.");
		return;
	}
	let wordCount = 0;
	for (const word of words.value.all_words) {
		const characters = word.split("");
		const charData: CharacterMetadata[] = [];
		// create char object
		let charCount = insertCharObject(
			wordCount,
			characters,
			charData
		);
		// push word object
		let type = "word";
		insertWordObject(word, charData, wordCount, type);
		// push separator object
		insertSpacerObject(wordCount);

		wordCount++;
	}
}

function insertCharObject(
	wordCount: number,
	characters: string[],
	charData: CharacterMetadata[]
) {
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
	return charCount;
}

function insertWordObject(
	word: string,
	charData: CharacterMetadata[],
	wordCount: number,
	type: string
) {
	allData.value.push({
		word: word,
		characters: charData,
		index: wordCount,
		type: type,
	});
}

function insertSpacerObject(wordCount: number) {
	if (wordCount === words.value.all_words.length - 1) {
		return;
	}
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
		fetchWords();
	} else if (isBackspace(e)) {
		handleBackspace();
	} else if (isRestrictedKeys(e)) {
		console.log(key);
	} else {
		handleInput(key);
	}
}

function handleInput(key: string) {
	const time = Date.now();
	addTotalCharacters();
	const currentCorrectChar =
		allData.value[currentWordNum.value]?.characters[
			currentPendingWordIndex.value
		]?.character;
	totalWords = allData.value.length;
	if (key === currentCorrectChar) {
		handleCorrectInput(key);
	} else {
		handleIncorrectInput(key);
	}
	finalKeydown = time;
}

function addTotalCharacters() {
	const currentWordMetadata = allData.value[currentWordNum.value];
	if (currentWordMetadata && currentWordMetadata.type !== "separator") {
		sessionsInsertData.total_characters++;
	}
}

function handleCorrectInput(key: string) {
	const time = Date.now();
	const metadata = getCurrentMetadata();
	const currentWordLocation = currentWordNum.value;
	const currentWordMetadata = allData.value[currentWordLocation];
	const currentWord = allData.value[currentWordLocation]?.word;
	const currentWordLength =
		allData.value[currentWordLocation]?.characters.length;
	const currentCorrectCharLocation = currentPendingWordIndex.value;
	const noneExtra = isNoneExtra(metadata);
	deleteExtras(metadata);
	//check if start session
	if (isStartSession(metadata)) {
		handleStartSession();
	}
	updateTiming(time, metadata);
	updateStatus(metadata, noneExtra);
	if (isEndSession(metadata)) {
		handleEndSession(time);
		fetchWords(selectedKey.value);
	} else if (isEndWord(currentCorrectCharLocation, currentWordLength)) {
		handleEndWord(currentWord, currentWordMetadata.type);
	} else incrementChar();
	currentPendingWordIndex.value = currentCharNum.value;
}

type InputMetadata = {
	currentWordLocation: number;
	currentCharLocation: number;
	currentCorrectCharLocation: number;
	currentWordMetadata: WordMetadata;
	currentWordLength: number;
	currentCharMetadata: CharacterMetadata;
};

function getCurrentMetadata(): InputMetadata {
	const currentWordLocation = currentWordNum.value;
	const currentCharLocation = currentCharNum.value;
	const currentCorrectCharLocation = currentPendingWordIndex.value;
	const currentWordMetadata = allData.value[
		currentWordLocation
	] as WordMetadata;
	const currentWordLength = allData.value[currentWordLocation]?.characters
		.length as number;
	const currentCharMetadata =
		allData.value[currentWordLocation]?.characters[
			currentCharLocation
		];

	return {
		currentWordLocation,
		currentCharLocation,
		currentCorrectCharLocation,
		currentWordMetadata,
		currentWordLength,
		currentCharMetadata,
	};
}

function isNoneExtra(metadata: InputMetadata) {
	return (
		metadata.currentCharLocation ===
		metadata.currentCorrectCharLocation
	);
}

function updateTiming(time: number, metadata: InputMetadata) {
	const currentObj =
		allData.value[metadata.currentWordLocation]?.characters[
			metadata.currentCharLocation
		];
	currentObj.timing = isStartSession(
		metadata.currentWordLocation,
		metadata.currentCharLocation
	)
		? 0
		: (time - finalKeydown) / 1000;
}

function updateStatus(metadata: InputMetadata, isNoneExtra: boolean) {
	const currentObj =
		allData.value[metadata.currentWordLocation]?.characters[
			metadata.currentCharLocation
		];
	if (!isNoneExtra || currentIncorrect) {
		currentObj.status = "error";
		currentIncorrect = false;
	} else {
		updateTotalCorrects(metadata.currentWordMetadata);
		currentObj.status = "correct";
	}
}

function updateTotalCorrects(currentWordMetadata: WordMetadata) {
	if (currentWordMetadata && currentWordMetadata.type !== "separator") {
		sessionsInsertData.total_corrects++;
	}
}
/*
function updateDataset(key, time) {
	const currCharObj = datasetObject.value.find((i) => i.char === key);
	currCharObj.count++;
	currCharObj.totalValue += parseFloat(
		((time - finalKeydown) / 1000).toFixed(2)
	);
	currCharObj.value = parseFloat(
		(currCharObj.totalValue / currCharObj.count).toFixed(2)
	);
}
*/

function incrementWordAndResetChar() {
	currentWordNum.value++;
	currentCharNum.value = 0;
}

function incrementChar() {
	currentCharNum.value++;
}

function updatePendingWordIndex() {
	currentPendingWordIndex.value = currentCharNum.value;
}

function handleIncorrectInput(key: string) {
	if (!currentIncorrect) {
		sessionsInsertData.total_errors++;
	}
	currentIncorrect = true;
	insertExtraChar(key);
	currentPendingWordIndex.value++;
}

// function to delete extra values
function deleteExtras(metadata: InputMetadata) {
	if (
		metadata.currentCorrectCharLocation -
			metadata.currentCharLocation ===
		0
	) {
		return;
	}
	let totalExtras =
		metadata.currentCorrectCharLocation -
		metadata.currentCharLocation;
	allData.value[metadata.currentWordLocation]?.characters.splice(
		metadata.currentCharLocation,
		totalExtras
	);
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

function handleStartSession() {
	const mode = selectedMode.value;
	const difficulty = selectedDifficulty.value;
	const game_metadata = {};
	sessionRunning.value = true;
	resetInterval();
	resetLiveInterval();
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
		.toLocaleString();
	sessionsInsertData.total_characters = 1;
	startTime = Date.now();
	sessionsInsertData.mode = mode;
	sessionsInsertData.difficulty = difficulty;
	sessionsInsertData.game_metadata = game_metadata;
}

function handleEndSession(time: number) {
	fillFinalData(time);
	sessionRunning.value = false;
	// [TEMPORARY] fill the array instead of pushing to db
	pastSessions.value.push(JSON.parse(JSON.stringify(sessionsInsertData)));
	//insertSessionToDatabase()
}

function handleEndWord(word: string, type: "separator" | "word") {
	if (type === "word") {
		collectedWords.push(word);
	}
	incrementWordAndResetChar();
}

function handleLeaveSession() {}

function handleAfkOrOutOfFocus() {
	resetAllSessionData();
	resetIndexes();
	fillData();
	sessionRunning.value = false;
}

function insertExtraChar(key: string) {
	allData.value[currentWordNum.value].characters.splice(
		currentPendingWordIndex.value,
		0,
		{ character: key, timing: 0, status: "extra" }
	);
	sessionsInsertData.total_extras++;
}

function resetAllSessionData() {
	sessionsInsertData.start_time = undefined;
	startTime = undefined;
	sessionsInsertData.end_time = undefined;
	endTime = undefined;
	sessionsInsertData.wpm = 0;
	sessionsInsertData.cpm = 0;
	sessionsInsertData.raw = 0;
	sessionsInsertData.accuracy = 0;
	sessionsInsertData.consistency = 0;
	sessionsInsertData.total_corrects = 0;
	sessionsInsertData.total_errors = 0;
	sessionsInsertData.total_extras = 0;
	sessionsInsertData.total_missed = 0;
	sessionsInsertData.total_characters = 0;
	totalWords = 0;
	collectedWords = [];
}

function resetIndexes() {
	currentWordNum.value = 0;
	currentCharNum.value = 0;
	sessionsInsertData.total_extras = 0;
	currentPendingWordIndex.value = 0;
}

//db insert
function fillFinalData(time: number) {
	const corrects = sessionsInsertData.total_corrects;
	const errors = sessionsInsertData.total_errors;
	const extras = sessionsInsertData.total_extras;
	sessionsInsertData.total_characters = getTotalCharacters(
		selectedMode.value
	);
	const totalCharacters = sessionsInsertData.total_characters;
	const elapsedTime = time - startTime;
	sessionsInsertData.wpm = getWpm(corrects + errors, elapsedTime);
	sessionsInsertData.accuracy = getAccuracy(corrects, totalCharacters);
	sessionsInsertData.raw = getRaw(totalCharacters + extras, elapsedTime);
	sessionsInsertData.consistency = getConsistency(
		sessionsInsertData.wpm,
		sessionsInsertData.raw
	);
	endTime = Date.now();
	sessionsInsertData.end_time = new Date()
		.toISOString()
		.toLocaleString("ms-MY", {});
	sessionsInsertData.duration = (endTime - startTime) / 1000 / 60;
	sessionsInsertData.words = collectedWords;
	sessionsInsertData.total_words = totalWords;
}

function getWpm(totalAchievedCharacters: number, elapsedTime: number) {
	return parseFloat(
		calculateWPM(totalAchievedCharacters, elapsedTime).toFixed(2)
	);
}

function getAccuracy(corrects: number, totalCharacters: number) {
	return parseFloat(((corrects / totalCharacters) * 100).toFixed(2));
}

function getRaw(totalCharacters: number, elapsedTime: number) {
	return parseFloat(
		(
			Math.round(totalCharacters / 5) /
			(elapsedTime / 1000 / 60)
		).toFixed(2)
	);
}

function getConsistency(wpm: number, raw: number) {
	return parseFloat(((wpm / raw) * 100).toFixed(2));
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

// ui functions
function updateDifficultyAndFetch(e: Event) {
	const element = e.target as HTMLSelectElement;
	const difficulty = element.value as DifficultyOptions;
	selectedDifficulty.value = difficulty;
	fetchFreshWords();
}

function updateKeyAndFetch(e: Event) {
	const element = e.target as HTMLSelectElement;
	const key = element.value;
	selectedKey.value = key;
	fetchFreshWords(key);
}

// function resetlivetimer live wpm
function resetLiveInterval() {
	liveTimer.value = 0;
	liveRawWpm.value = 0;
	liveWpm.value = 0;
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
		liveRawWpm.value =
			pastSessions.value[pastSessions.value.length - 1].raw;
		liveWpm.value =
			pastSessions.value[pastSessions.value.length - 1].wpm;
		return;
	}
	if (!startTime) {
		startTime = Date.now();
	}
	const elapsedTime = Date.now() - startTime;

	const wpm = parseFloat(
		calculateWPM(
			sessionsInsertData.total_corrects +
				sessionsInsertData.total_errors,
			elapsedTime
		).toFixed(2)
	);
	const rawWPM = parseFloat(
		calculateRawWPM(
			sessionsInsertData.total_characters,
			elapsedTime
		).toFixed(2)
	);

	liveTimer.value = intervalCount;
	liveRawWpm.value = rawWPM;
	liveWpm.value = wpm;
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
watchEffect(async () => {
	if (user.value) {
		PROFILE.value = await getProfile(user.value.id);
	}
});

async function getProfile(userId: string) {
	const { data, error } = await client
		.from("profile")
		.select()
		.eq("user_id", userId)
		.single();
	if (error) {
		console.log(error);
	}
	return data;
}

// pure functions and checkers
function getTotalWords(mode: string): string[] {
	return mode === "word" ? words.value?.all_words : undefined;
}

function getTotalCharacters(mode: string): number {
	return mode === "word" ? words.value?.no_characters : undefined;
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

function isStartSession(metadata: InputMetadata) {
	return (
		metadata.currentWordLocation === 0 &&
		metadata.currentCharLocation === 0
	);
}

function isEndSession(metadata: InputMetadata) {
	// if mode === word
	return (
		metadata.currentWordLocation === allData.value.length - 1 &&
		metadata.currentCharLocation === metadata.currentWordLength - 1
	);
}

function isEndWord(currentCharLocation: number, currentWordLength: number) {
	return currentCharLocation === currentWordLength - 1;
}

// utils
function focusInput() {
	document.getElementById("MasterInput")?.focus();
}

function calculateWPM(totalChars: number, elapsedTime: number) {
	const words = totalChars / 5;
	const minutes = elapsedTime / 1000 / 60;
	return words / minutes;
}

function calculateRawWPM(totalChars: number, elapsedTime: number) {
	const words = totalChars / 5;
	const minutes = elapsedTime / 1000 / 60;
	return words / minutes;
}
</script>
