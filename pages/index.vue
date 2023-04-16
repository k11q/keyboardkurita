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
		<div
			:class="`flex flex-col items-center gap-2 fixed w-screen left-0 right-0 px-10 transition-all z-10 ease-in-out duration-400 ${
				currentActive &&
				currentActive.id === 'MasterInput'
					? 'bottom-10'
					: 'bottom-1/2'
			}`"
		>
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
						: focusInput()
				"
				class="text-neutral-300 hover:text-white cursor-pointer px-6 py-5 text-xl font-mono"
			>
				click to activate
			</div>
			<div
				class="bg-neutral-900 mb-5 px-6 py-2 h-14 rounded-full text-xs items-center flex justify-between relative max-w-4xl w-full"
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
									key ===
									""
										? "Any key"
										: key.toUpperCase()
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
			:class="`font-mono relative transition-all ease-linear duration-1000 mb-6 min-h-[20rem] pt-20 pb-6 px-6 rounded-[32px] w-full text-4xl leading-[54px]`"
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
								: 'opacity-40'
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
			></div>
		</div>
		<input
			type="text"
			id="MasterInput"
			@keydown="handleKeydown"
			style="opacity: 0%; position: absolute"
		/>
		<!--
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
		-->
	</div>
</template>

<script setup lang="ts">
import { WritableComputedRef } from "vue";
import {
	useHomeStore,
	KEYOPTIONS,
	DIFFICULTY,
	MODES,
	DATASETS,
} from "@/stores/home";
import type {
	SessionsInsert,
	CharacterPerformanceInsert,
	WordPerformanceInsert,
	KeystrokeLogsInsert,
	IntervalLogsInsert,
} from "../utils/db/sessions";
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
import type {
	CharacterMetadata,
	WordMetadata,
	WordType,
} from "@/server/api/words";
import { calculateRawWPM, calculateWPM, focusInput } from "@/utils/input";

//types
type KeystrokeLog = { character: string; time: number; status: CharLogStatus };
type ChartData = {
	wpm: number[];
	raw: number[];
	error: number[];
	time: number[];
};
type CharacterPerformance = {
	character: string;
	wpm: number;
	count: number;
	errors: number;
	extras: number;
	misses: number;
	corrects: number;
};

type InputMetadata = {
	currentWordLocation: number;
	currentCharLocation: number;
	currentCorrectCharLocation: number;
	currentWordMetadata: WordMetadata;
	currentWordLength: number;
	currentCharMetadata: CharacterMetadata;
	currentWord: string;
	currentCorrectChar: string;
	currentWordType: WordType;
};

//db & auth
const user = useSupabaseUser();
const client = useSupabaseClient();

const store = useHomeStore();

// readonly
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
let collectedWords: string[] = [];
//final object to insert to db
let sessionsInsertData: SessionsInsert = {
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
	logs: [],
	xp_gains: 0,
	dataset: "english_50k",
	chart_data: {},
	numbers: false,
	punctuation: false,
	restart_count: 0,
};

const characterPerformance: CharacterPerformanceInsert[] = [];
const wordPerformance: WordPerformanceInsert[] = [];
const intervalPerformance: IntervalLogsInsert[] = [];
const keystrokeLogs: KeystrokeLogsInsert[] = [];
const chartData: ChartData = { wpm: [], error: [], raw: [], time: [] };

// variable for logging wpm and row in interval
let charactersPerThreeSecondCount = 0;
let intervalCount = 1;
const liveWpm = ref(0);
const liveRawWpm = ref(0);
const liveTimer = ref(0);
let intervalError = 0;
let intervalCharacterCount = 0;

let totalCharactersCount = 0;
let totalWordsCount = 0;
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

const currentMetadata: globalThis.ComputedRef<InputMetadata> = computed(() => {
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
	const currentWord = allData.value[currentWordLocation].word;
	const currentCorrectChar =
		allData.value[currentWordNum.value]?.characters[
			currentPendingWordIndex.value
		]?.character;
	const currentWordType = allData.value[currentWordLocation].type;

	return {
		currentWordLocation,
		currentCharLocation,
		currentCorrectCharLocation,
		currentWordMetadata,
		currentWordLength,
		currentCharMetadata,
		currentWord,
		currentCorrectChar,
		currentWordType,
	};
});

// writable computed ref is used for write only, get is gotten from currentmetadata.
const currentCharacterStatus: WritableComputedRef<CharLogStatus> = computed({
	get: (): CharLogStatus => {
		return allData.value[currentWordNum.value]?.characters[
			currentCharNum.value
		].status;
	},
	set: (newValue: CharLogStatus): void => {
		allData.value[currentWordNum.value].characters[
			currentCharNum.value
		].status = newValue;
	},
});

// writable computed ref is used for write only, get is gotten from currentmetadata.
const currentCharacterTiming: WritableComputedRef<number> = computed({
	get: (): number => {
		return allData.value[currentWordNum.value]?.characters[
			currentCharNum.value
		].timing;
	},
	set: (newValue: number): void => {
		allData.value[currentWordNum.value].characters[
			currentCharNum.value
		].timing = newValue;
	},
});

// ui states
const isOpen = useState("isOpen", () => false);
const loading = ref(false);

//manage carot
const CAROTLEFT = ref(0);
const CAROTTOP = ref(0);

//temporary placeholder for db
const pastSessions: globalThis.Ref<SessionsInsert[]> = ref([]);

// miscs
let timeoutId: NodeJS.Timeout;

async function fetchWords(char = "") {
	loading.value = true;
	if (char) {
		selectedKey.value = char.charAt(0);
	}
	resetIndexes();
	resetAllSessionData();
	resetCounters();
	if (words.value && words.value.next_data) {
		words.value = words.value.next_data;
		setupData();
		words.value.next_data = await fetchWordsAndReturn();
	} else {
		words.value = await fetchWordsAndReturn();
		setupData();
	}
	function setupData() {
		fillData();
		focusInput();
		loading.value = false;
	}
}

async function fetchFreshWords(char = "") {
	loading.value = true;
	if (char) {
		selectedKey.value = char.charAt(0);
	}
	resetIndexes();
	resetAllSessionData();
	resetCounters();
	words.value = await fetchWordsAndReturn();
	fillData();
	focusInput();
	loading.value = false;
}

async function fetchWordsAndReturn() {
	const { data } = await useFetch(
		`api/words?char=${selectedKey.value.charAt(0)}&difficulty=${
			selectedDifficulty.value
		}&num=${selectedWords.value}`
	);
	return data.value;
}

function fillData() {
	if (!words.value || !words.value.all_data) {
		console.log(
			"Error: fillData(): No all_data found from returned words.value or words.value doesnt exist."
		);
		return;
	}
	allData.value = words.value.all_data;
}

function handleKeydown(e: KeyboardEvent) {
	e.preventDefault();
	e.stopImmediatePropagation();

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
		console.log("Keydown unhandled! Restricted key: ", key);
	} else {
		handleInput(key);
	}
}

function handleInput(key: string) {
	const currentCorrectChar = currentMetadata.value.currentCorrectChar;

	finalKeydown = Date.now();
	incrementTotalCharacters();
	pushCharacterPerformance(key);
	if (key === currentCorrectChar) {
		handleCorrectInput();
	} else {
		handleIncorrectInput(key);
	}
}

function incrementTotalCharacters() {
	if (currentMetadata.value.currentWordType !== "separator") {
		totalCharactersCount++;
	}
}

function pushCharacterPerformance(key: string) {
	const currentCharacterObject = characterPerformance.find(
		(i) => i.character === key
	);
	const currentCorrectChar = currentMetadata.value.currentCorrectChar;
	const character = key;
	const corrects = getCorrects();
	const count = getCount();
	const errors = getError();
	const wpm = getWpm();
	let session_id: number; // fill at the end

	upsertCharacterPerformance();

	function getCorrects() {
		let corrects = currentCharacterObject
			? currentCharacterObject.corrects
			: 0;
		return key === currentCorrectChar ? corrects + 1 : corrects;
	}
	function getCount() {
		return currentCharacterObject
			? currentCharacterObject.count + 1
			: 1;
	}
	function getError() {
		let error = currentCharacterObject
			? currentCharacterObject.errors | 0
			: 0;
		return currentIncorrect ? error : error + 1;
	}
	function getWpm() {
		return 0;
	}
	function upsertCharacterPerformance() {
		const index = characterPerformance.findIndex(
			(i) => i.character === key
		);

		const updatedCharacterObject = {
			character,
			count,
			errors,
			corrects,
			wpm,
			session_id,
		};

		if (index !== -1) {
			Object.assign(
				characterPerformance[index],
				updatedCharacterObject
			);
		} else {
			characterPerformance.push(updatedCharacterObject);
		}
	}
}

function handleCorrectInput() {
	const time = Date.now();

	if (isStartSession()) {
		handleStartSession();
	}
	incrementIntervalCharacterCount();
	deleteExtras();
	updateTiming(time);
	updateStatus();
	if (isEndSession()) {
		handleEndSession(time);
		fetchWords(selectedKey.value);
	} else if (isEndWord()) {
		totalWordsCount++;
		handleEndWord();
	} else {
		incrementChar();
	}
	updatePendingWordIndex();
}

function incrementIntervalCharacterCount(): void {
	intervalCharacterCount++;
}

function isNoneExtra() {
	const metadata = currentMetadata.value;
	const currentCharLocation = metadata.currentCharLocation;
	const currentCorrectCharLocation = metadata.currentCorrectCharLocation;
	return currentCharLocation === currentCorrectCharLocation;
}

function updateTiming(time: number) {
	currentCharacterTiming.value = isStartSession()
		? 0
		: (time - finalKeydown) / 1000;
}

function updateStatus() {
	if (currentIncorrect) {
		currentCharacterStatus.value = "error";
		currentIncorrect = false;
	} else {
		updateTotalCorrects();
		currentCharacterStatus.value = "correct";
	}
}

function updateTotalCorrects() {
	const currentWordMetadata = currentMetadata.value.currentWordMetadata;
	if (currentWordMetadata && currentWordMetadata.type !== "separator") {
		sessionsInsertData.total_corrects++;
	}
}

function incrementWord() {
	currentWordNum.value++;
}

function resetCharNum() {
	currentCharNum.value = 0;
}

function incrementChar() {
	currentCharNum.value++;
}

function updatePendingWordIndex() {
	currentPendingWordIndex.value = currentCharNum.value;
}

function handleIncorrectInput(key: string): void {
	if (!currentIncorrect) {
		sessionsInsertData.total_errors++;
	}
	intervalError++;
	currentIncorrect = true;
	insertExtraChar(key);
	currentPendingWordIndex.value++;
}

// function to delete extra values
function deleteExtras(): void {
	const metadata = currentMetadata.value;
	if (isNoneExtra()) {
		return;
	}
	let totalExtras = countExtras();
	allData.value[metadata.currentWordLocation]?.characters.splice(
		metadata.currentCharLocation,
		totalExtras
	);
}

function countExtras(): number {
	const metadata = currentMetadata.value;
	return (
		metadata.currentCorrectCharLocation -
		metadata.currentCharLocation
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
	const game_metadata = {};
	sessionRunning.value = true;
	resetInterval();
	resetLiveInterval();
	timeoutId = setTimeout(updateWPM, 1000);
	resetAllSessionData();
	resetCounters();
	fillData();
	startTime = Date.now();
	fillInitialData();
}

function fillInitialData() {
	const user_username = USERNAME.value;
	const user_id = PROFILE.value?.id;
	const start_time = new Date().toISOString().toLocaleString();
	const total_characters = 1;
	const mode = selectedMode.value;
	const difficulty = selectedDifficulty.value;
	const game_metadata = {};

	const initialFilledData = {
		user_username,
		user_id,
		start_time,
		total_characters,
		mode,
		difficulty,
		game_metadata,
	};

	Object.assign(sessionsInsertData, initialFilledData);
}

function handleEndSession(time: number) {
	fillFinalData(time);
	sessionRunning.value = false;
	// [TEMPORARY] fill the array instead of pushing to db
	pastSessions.value.push(JSON.parse(JSON.stringify(sessionsInsertData)));
	//insertSessionToDatabase()
}

function handleEndWord() {
	const metadata = currentMetadata.value;
	if (metadata.currentWordMetadata.type === "word") {
		insertWord(metadata.currentWord);
	}
	incrementWord();
	resetCharNum();
}

function insertWord(word: string) {
	collectedWords.push(word);
}

function handleLeaveSession() {}

function handleAfkOrOutOfFocus() {
	resetAllSessionData();
	resetCounters();
	resetIndexes();
	fillData();
	sessionRunning.value = false;
}

function insertExtraChar(key: string) {
	addExtraCharToDisplay(key);
	sessionsInsertData.total_extras
		? sessionsInsertData.total_extras++
		: (sessionsInsertData.total_extras = 1);
}

function addExtraCharToDisplay(key: string) {
	allData.value[currentWordNum.value].characters.splice(
		currentPendingWordIndex.value,
		0,
		{ character: key, timing: 0, status: "extra" }
	);
}

function resetAllSessionData() {
	const emptySession = {
		user_username: "",
		user_id: 0,
		start_time: "",
		difficulty: "",
		mode: "",
		game_metadata: {},
		end_time: "",
		duration: 0,
		wpm: 0,
		accuracy: 0,
		consistency: 0,
		raw: 0,
		total_corrects: 0,
		total_errors: 0,
		total_extras: 0,
		total_missed: 0,
		total_characters: 0,
		total_words: 0,
		words: [],
		logs: [],
		xp_gains: 0,
		dataset: "english_50k",
		chart_data: {},
		numbers: false,
		punctuation: false,
		restart_count: 0,
	};
	Object.assign(sessionsInsertData, emptySession);
}

function resetCounters() {
	startTime = undefined;
	endTime = undefined;
	collectedWords = [];
}

function resetIndexes() {
	currentWordNum.value = 0;
	currentCharNum.value = 0;
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
	sessionsInsertData.end_time = new Date(time)
		.toISOString()
		.toLocaleString("ms-MY", {});
	sessionsInsertData.duration = parseFloat(
		(elapsedTime / 1000).toFixed(2)
	);
	sessionsInsertData.words = collectedWords;
	sessionsInsertData.total_words = getTotalWords();
	sessionsInsertData.xp_gains = parseFloat(
		(sessionsInsertData.accuracy / 10).toFixed(2)
	);
	sessionsInsertData.logs = allData.value;
	Object.assign(sessionsInsertData.chart_data, chartData);
}

function getWpm(totalAchievedCharacters: number, elapsedTime: number) {
	return parseFloat(
		(
			Math.round(totalAchievedCharacters / 5) /
			(elapsedTime / 1000 / 60)
		).toFixed(2)
	);
}

function getCpm(wpm: number) {
	return wpm * 5;
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
		.insert(sessionsInsertData)
		.select();
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
		if (pastSessions.value.length) {
			liveRawWpm.value =
				pastSessions.value[
					pastSessions.value.length - 1
				].raw;
			liveWpm.value =
				pastSessions.value[
					pastSessions.value.length - 1
				].wpm;
		}
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
	chartData.wpm.push(wpm);
	chartData.error.push(intervalError);
	chartData.time.push(intervalCount);
	chartData.raw.push(rawWPM);
	intervalError = 0;
	timeoutId = setTimeout(updateWPM, 1000); // Log the values every second
}

//watch if input out of focus
watch(currentActive, () => {
	if (currentActive.value.id !== "MasterInput") {
		handleAfkOrOutOfFocus();
	}
});

onMounted(() => {
	requestAnimationFrame(setCaretPosition);

	function setCaretPosition() {
		const cursorKey = document.querySelector(".cursor-key");
		if (cursorKey?.getBoundingClientRect()) {
			const rect = cursorKey?.getBoundingClientRect();

			CAROTLEFT.value = rect.left;
			CAROTTOP.value = rect.top;
			currentActive.value = document.activeElement;
		}
		requestAnimationFrame(setCaretPosition);
	}
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
function getTotalWords(): number | undefined {
	if (selectedMode.value === "word") {
		return words.value?.num_words;
	} else if (selectedMode.value === "time") {
		console.log("time not implemented yet");
		return totalWordsCount;
	}
	console.log("total words not found");
}

function getTotalCharacters(): number | undefined {
	if (selectedMode.value === "word") {
		return words.value?.num_characters;
	} else if (selectedMode.value === "time") {
		console.log("time not implemented yet");
		return totalCharactersCount;
	}
	console.log("total characters not found");
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

function isStartSession() {
	const metadata = currentMetadata.value;
	return (
		metadata.currentWordLocation === 0 &&
		metadata.currentCharLocation === 0
	);
}

function isEndSession() {
	const metadata = currentMetadata.value;
	return (
		metadata.currentWordLocation === allData.value.length - 1 &&
		metadata.currentCharLocation === metadata.currentWordLength - 1
	);
}

function isEndWord() {
	const metadata = currentMetadata.value;
	return metadata.currentCharLocation === metadata.currentWordLength - 1;
}
</script>
