<template>
	<div
		class="max-w-6xl w-full flex flex-col flex-grow relative sm:px-6 xl:px-0"
	>
		<!--MODAL SETTINGS COMPONENT-->
		<MoreSettings />
		<!--LIVE INFO INTERVAL WPM RAW-->
		<LiveInfo
			:session-running="sessionRunning"
			:live-timer="liveTimer"
			:live-wpm="liveWpm"
			:live-raw="liveRawWpm"
		/>
		<!--INPUT PAGE - TEXT COMPONENT-->
		<InputDisplay
			:show-results="showResults"
			:all-data="allData"
			:current-active="currentActive"
			:current-word-num="currentWordNum"
			:correct-char-index="correctCharIndex"
			@button-click="
				currentActive &&
				currentActive.id === 'MasterInput'
					? ''
					: focusInput()
			"
		/>
		<!--CARET COMPONENT-->
		<Caret
			:is-visible="
				currentActive &&
				currentActive.id === 'MasterInput'
			"
			:caret-left="CARETLEFT"
			:caret-top="CARETTOP"
		/>
		<!--OUTFOCUSOVERLAY CLICK TO ACTIVATE OVERLAY AND SETTINGS/MENU-->
		<OutFocusOverlay
			:should-show="
				!currentActive ||
				(currentActive &&
					currentActive.id !== 'MasterInput')
			"
			@button-click="
				() => {
					if (!allData.length) {
						fetchWords();
						focusInput();
					} else {
						focusInput();
					}
				}
			"
		/>
		<!--RESULTS PAGE - CHART COMPONENT AND MENUBAR-->
		<div
			v-if="showResults"
			class="flex-grow flex flex-col justify-center z-50 gap-10 bg-neutral-900 font-mono"
		>
			<!--RESULTSGRID COMPONENT-->
			<ResultsGrid
				:past-sessions="pastSessions"
				:current-selection-data="currentSelectionData"
				:current-word-num="currentWordNum"
				:correct-char-index="correctCharIndex"
				:focus-input="focusInput"
			/>
			<!--RESULTSMENU COMPONENT-->
			<ResultsMenu
				:date="format(new Date(currentSelectionData!.end_time), 'dd MMM yyyy HH:mm')"
				:username="USERNAME"
				@button-click="
					() => {
						showResults = false;
						fetchWords();
						focusInput();
					}
				"
			/>
		</div>
		<!--(HIDDEN)INPUT COMPONENT-->
		<input
			id="MasterInput"
			type="text"
			style="opacity: 0%; position: absolute"
			@keydown.prevent.stop="handleKeydown"
		/>
		<!--FOOT COMPONENT-->
		<Footer />
	</div>
</template>

<script setup lang="ts">
import { WritableComputedRef } from 'vue';
import {
	useHomeStore,
	KEYOPTIONS,
	DIFFICULTY,
	MODES,
	DATASETS,
} from '@/stores/home';
import type {
	SessionsInsert,
	CharacterLogsInsert,
	WordLogsInsert,
	IntervalLogsInsert,
} from '../utils/db/sessions';
import { format } from 'date-fns';
import { storeToRefs } from 'pinia';
import type {
	DifficultyOptions,
	ModesOptions,
	ConfigDurationOptions,
	ConfigTotalWordsOptions,
	ConfigSelectionOptions,
	CharLogStatus,
	CharacterMetadata,
	WordMetadata,
	WordType,
	ChartData,
	InputMetadata,
	KeystrokeLog,
	WordLogStatus,
} from '@/types';
import { calculateRawWPM, calculateWPM, focusInput } from '@/utils/input';
import type { Database } from '~/types/database.types';

definePageMeta({
	middleware: 'auth',
});

//db & auth
const user = useSupabaseUser();
const client = useSupabaseClient<Database>();

const router = useRouter();
const store = useHomeStore();

// readonly
const PROFILE = useState('profile', () => '');
const USERNAME = useState('username', () => '');

// game settings
const {
	difficulty: selectedDifficulty,
	duration: selectedDuration,
	words: selectedWords,
	mode: selectedMode,
	key: selectedKey,
	dataset: selectedDataset,
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
const sessionRunning = ref(false);
const showResults = ref(false);
let collectedWords: string[] = [];
//final object to insert to db
const sessionsInsertData: SessionsInsert = {
	//required
	user_id: 0,
	//insert at start
	start_time: '',
	difficulty: '',
	mode: '',
	game_metadata: {},
	//insert at end
	end_time: '',
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
	dataset: '',
	numbers: false,
	punctuation: false,
	restart_count: 0,
};
let characterLogs: CharacterLogsInsert[] = [];
let wordLogs: WordLogsInsert[] = [];
let intervalLogs: IntervalLogsInsert[] = [];
let chartData: ChartData = { wpm: [], error: [], raw: [], time: [] };

// variable for logging wpm and row in interval
let intervalCount = 1;
const liveWpm = ref(0);
const liveRawWpm = ref(0);
const liveTimer = ref(0);
let intervalError = 0;
let intervalCharacterCount = 0;
let characterCountPerFiveSeconds: number[] = [];
let totalCharactersCount = 0;
let totalWordsCount = 0;
let totalErrorsCount = 0;
let totalCorrectsCount = 0;
const totalExtrasCount = 0;
let sessionId: number;

//
const currentActive = ref();

// main data to store the words state
const allData: globalThis.Ref<WordMetadata[]> = ref([]);
// storing state for managing ui
const currentWordNum = ref(0);
const currentCharNum = ref(0);
const correctCharIndex = ref(0);
// stores the fetched data
const words = ref();

//
let startTime: number | undefined;
let endTime: number | undefined;
let currentIncorrect = false;
let finalKeydown = Date.now();

// ui states
const isOpen = useState('isOpen', () => false);
const loading = ref(false);
const currentSelection: globalThis.Ref<WordMetadata[]> = ref([]);
const currentSelectionData = computed(() => {
	if (pastSessions.value.length) {
		return pastSessions.value[pastSessions.value.length - 1];
	} else {
		return undefined;
	}
});

//manage carot
const CARETLEFT = ref(0);
const CARETTOP = ref(0);

//temporary placeholder for db
const pastSessions: globalThis.Ref<SessionsInsert[]> = ref([]);

// miscs
let timeoutId: NodeJS.Timeout;

// metadata (for tracking user inputs)
const currentMetadata: globalThis.ComputedRef<InputMetadata> = computed(() => {
	const currentWordLocation = currentWordNum.value;
	const currentCharLocation = currentCharNum.value;
	const currentCorrectCharLocation = correctCharIndex.value;
	const currentWordMetadata = allData.value[
		currentWordLocation
	] as WordMetadata;
	const currentWordLength = allData.value[currentWordLocation]?.characters
		.length as number;
	const currentChar =
		allData.value[currentWordLocation]?.characters[
			currentCharLocation
		]?.character;
	const currentCharMetadata =
		allData.value[currentWordLocation]?.characters[
			currentCharLocation
		];
	const currentWord = allData.value[currentWordLocation].word;
	const currentCorrectChar =
		allData.value[currentWordNum.value]?.characters[
			correctCharIndex.value
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
		currentChar,
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
const currentCharacterEndTime: WritableComputedRef<string> = computed({
	get: (): string => {
		return allData.value[currentWordNum.value]?.characters[
			currentCharNum.value
		].end_time;
	},
	set: (newValue: string): void => {
		allData.value[currentWordNum.value].characters[
			currentCharNum.value
		].end_time = newValue;
	},
});
const currentCharacterStartTime: WritableComputedRef<string> = computed({
	get: (): string => {
		return allData.value[currentWordNum.value]?.characters[
			currentCharNum.value
		].start_time;
	},
	set: (newValue: string): void => {
		allData.value[currentWordNum.value].characters[
			currentCharNum.value
		].start_time = newValue;
	},
});

// writable computed ref is used for write only, get is gotten from currentmetadata.
const currentCharacterDuration: WritableComputedRef<number> = computed({
	get: (): number => {
		return allData.value[currentWordNum.value].characters[
			currentCharNum.value
		].duration;
	},
	set: (newValue: number): void => {
		allData.value[currentWordNum.value].characters[
			currentCharNum.value
		].duration = newValue;
	},
});

//
async function fetchWords() {
	loading.value = true;
	resetEverything();
	if (words.value && words.value.next_data) {
		getWordsCache();
	} else {
		words.value = await getWords();
	}
	fillData();
	loading.value = false;
}

async function getWordsCache() {
	words.value = words.value.next_data;
	words.value.next_data = await getWords();
}

async function fetchFreshWords() {
	loading.value = true;
	resetEverything();
	words.value = await getWords();
	fillData();
	loading.value = false;
}

async function getWords() {
	let num: number;
	if (selectedMode.value === 'word') {
		num = selectedWords.value | 10;
	} else {
		num = 50;
	}
	const { data } = await useFetch(`api/languages`, {
		query: {
			char: selectedKey.value.charAt(0),
			difficulty: selectedDifficulty.value,
			num,
			lang: selectedDataset.value,
		},
	});
	return data.value;
}

//reset all states
function resetEverything() {
	resetIndexes();
	resetAllSessionData();
	resetCounters();
}

function fillData() {
	if (!words.value || !words.value.all_data) {
		console.log(
			'Error: fillData():\
			No all_data found from returned words.value\
			or words.value doesnt exist.'
		);
		return;
	}
	allData.value = JSON.parse(JSON.stringify(words.value.all_data));
}

function handleKeydown(e: KeyboardEvent) {
	if (loading.value || !allData.value.length) {
		return;
	}
	const key = e.key;
	// tab used to start new game
	if (key === 'Tab') {
		sessionRunning.value = false;
		fetchWords();
	} else if (isBackspace(e)) {
		handleBackspace();
	} else if (isRestrictedKeys(e)) {
		console.log('Keydown unhandled! Restricted key: ', key);
	} else {
		handleInput(key);
	}
}

function handleInput(key: string) {
	const currentCorrectChar = currentMetadata.value.currentCorrectChar;

	if (isStartSession()) {
		handleStartSession();
	}
	incrementTotalCharactersCount();
	if (key === currentCorrectChar) {
		handleCorrectInput();
	} else {
		handleIncorrectInput(key);
	}
	finalKeydown = Date.now();
}

function incrementTotalCharactersCount() {
	if (currentMetadata.value.currentWordType !== 'separator') {
		totalCharactersCount++;
	}
}

function handleCorrectInput() {
	const time = Date.now();

	deleteExtras();
	const duration = getCharDuration(time);
	const status = getStatus();
	incrementIntervalCharacterCount();
	incrementTotalCorrectsCount();
	updateCurrentCharacterObject();
	if (currentMetadata.value.currentWordType != 'separator') {
		pushCharacterLogs();
	}
	if (isEndSession()) {
		handleEndSession(time);
		return;
	} else if (isEndWord()) {
		handleEndWord();
	} else {
		incrementChar();
	}
	resetCorrectCharIndex();
	resetCurrentIncorrect();

	function updateCurrentCharacterObject() {
		currentCharacterEndTime.value = new Date(time)
			.toISOString()
			.toLocaleString();
		currentCharacterStartTime.value = new Date(finalKeydown)
			.toISOString()
			.toLocaleString();
		currentCharacterStatus.value = status;
	}
	function pushCharacterLogs() {
		//to push
		const metadata = currentMetadata.value;
		const index = metadata.currentCharLocation;
		const character = metadata.currentChar;
		const wordIndex = metadata.currentWordMetadata.index;
		const startTime = new Date(finalKeydown)
			.toISOString()
			.toLocaleString();
		const endTime = new Date(time).toISOString().toLocaleString();
		const wpm = getCharWpm();
		let session_id: number; // fill at the end

		//checks
		if (!character) {
			return;
		}

		// insert function
		insertCharacterLogs();

		function getCharWpm() {
			if (index === 0 && wordIndex === 0) {
				return null;
			}
			return parseFloat((60 / duration / 5).toFixed(2));
		}
		function insertCharacterLogs() {
			const updatedCharObject = {
				index,
				character,
				word_index: wordIndex,
				start_time: startTime,
				end_time: endTime,
				duration: duration,
				status,
				wpm,
				session_id,
			};
			characterLogs.push(updatedCharObject);
		}
	}
	function getCharDuration(time: number) {
		return (time - finalKeydown) / 1000;
	}
}
function resetCurrentIncorrect() {
	currentIncorrect = false;
}

function incrementIntervalCharacterCount(): void {
	intervalCharacterCount++;
}

function getStatus(): CharLogStatus {
	if (currentIncorrect) {
		return 'error';
	} else {
		return 'correct';
	}
}

function incrementTotalCorrectsCount() {
	const currentWordMetadata = currentMetadata.value.currentWordMetadata;
	if (
		!currentIncorrect &&
		currentWordMetadata &&
		currentWordMetadata.type !== 'separator'
	) {
		totalCorrectsCount++;
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

function resetCorrectCharIndex() {
	correctCharIndex.value = currentCharNum.value;
}

function handleIncorrectInput(key: string): void {
	incrementTotalErrorsCount();
	incrementIntervalError();
	insertExtraChar(key);
	currentIncorrect = true;
	correctCharIndex.value++;
}

function incrementTotalErrorsCount(): void {
	if (!currentIncorrect) {
		totalErrorsCount++;
	}
}

function incrementIntervalError(): void {
	intervalError++;
}

// function to delete extra values
function deleteExtras(): void {
	const metadata = currentMetadata.value;
	const totalExtras = getExtrasCount();

	if (totalExtras > 0) {
		allData.value[metadata.currentWordLocation]?.characters.splice(
			metadata.currentCharLocation,
			totalExtras
		);
	}
}

function getExtrasCount(): number {
	const metadata = currentMetadata.value;
	return (
		metadata.currentCorrectCharLocation -
		metadata.currentCharLocation
	);
}

function handleBackspace() {
	if (isStartSession()) {
		return;
	}
	if (
		allData.value.length &&
		allData.value[currentWordNum.value].characters[
			correctCharIndex.value - 1
		].status === 'extra'
	) {
		allData.value[currentWordNum.value].characters.splice(
			correctCharIndex.value - 1,
			1
		);
		correctCharIndex.value--;
	}
}

function handleStartSession() {
	finalKeydown = Date.now();
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
	const user_id = PROFILE.value?.id;
	const start_time = new Date(Date.now()).toISOString().toLocaleString();
	const total_characters = 1;
	const mode = selectedMode.value;
	const difficulty = selectedDifficulty.value;
	const dataset = selectedDataset.value;
	const game_metadata = {};
	const initialFilledData = {
		user_id,
		start_time,
		total_characters,
		mode,
		difficulty,
		game_metadata,
		dataset,
	};
	Object.assign(sessionsInsertData, initialFilledData);
}

async function handleEndSession(time: number) {
	loading.value = true;
	const metadata = currentMetadata.value;
	if (metadata.currentWordMetadata.type === 'word') {
		insertWord(metadata.currentWord); // end word
		pushWordLogs();
	}
	fillFinalIntervalValues();
	fillFinalData(time);
	sessionRunning.value = false;
	// [TEMPORARY] fill the array instead of pushing to db
	pastSessions.value = []; // clear it first
	pastSessions.value.push(JSON.parse(JSON.stringify(sessionsInsertData)));
	if (PROFILE.value && USERNAME.value) {
		const insertedSession = await insertSessionToDatabase();
		sessionId = insertedSession[0].id;
		fillSessionIdToLogs();
		insertLogsToDatabase();
	}
	setShowResults();
	fetchWords();
	loading.value = false;
}

function fillSessionIdToLogs() {
	addSessionIdToLogs(characterLogs);
	addSessionIdToLogs(wordLogs);
	addSessionIdToLogs(intervalLogs);
}

function addSessionIdToLogs(logs) {
	logs.forEach((log) => {
		log.session_id = sessionId;
	});
}

function fillFinalIntervalValues() {
	insertCharacterCountPerSecond();
	const currentTime = Date.now();
	const elapsedTime = currentTime - startTime!;
	let durationRaw;
	if (elapsedTime < 5000) {
		const wholeSeconds = Math.floor(elapsedTime / 1000);
		const differenceWithoutRemainder = wholeSeconds * 1000;
		durationRaw = (elapsedTime % 1000) + differenceWithoutRemainder;
	} else {
		durationRaw = (elapsedTime % 1000) + 4000;
	}
	const durationSeconds = parseFloat((elapsedTime / 1000).toFixed(2));
	const wpm = getWpm(totalCorrectsCount + totalErrorsCount, elapsedTime);
	const rawWpm = getRaw(
		getTotalCharactersInLastFiveSeconds(),
		durationRaw
	);
	if (selectedMode.value === 'word') {
		insertChartDataLog(wpm, intervalError, durationSeconds, rawWpm);
	} else if (selectedMode.value === 'time') {
		insertChartDataLog(
			wpm,
			intervalError,
			selectedDuration.value,
			rawWpm
		);
	}

	pushIntervalLogs(
		wpm,
		intervalError,
		durationSeconds,
		rawWpm,
		currentTime
	);
}

function setShowResults() {
	showResults.value = true;
	setTimeout(() => {
		document.getElementById('nextTest')?.focus();
	}, 0);
}

function handleEndWord() {
	const metadata = currentMetadata.value;
	if (metadata.currentWordMetadata.type === 'word') {
		insertWord(metadata.currentWord);
		pushWordLogs();
	}
	incrementWord();
	incrementWordCount();
	resetCharNum();
}

function pushWordLogs() {
	//internal
	const wordLength = currentMetadata.value.currentWordLength;
	//to push
	const index = getWordIndex();
	const word = currentMetadata.value.currentWord;
	const type = getWordType();
	const startTime = getWordStartTime();
	const endTime = getWordEndTime();
	const duration = getWordDuration();
	const status = getWordStatus();
	const wpm = getWordWpm();
	let session_id: number; // fill at the end

	insertWordLogs();

	function getWordIndex() {
		return currentMetadata.value.currentWordMetadata.index;
	}
	function getWordType() {
		return currentMetadata.value.currentWordMetadata.type;
	}
	function getWordStartTime() {
		return currentMetadata.value.currentWordMetadata.characters[0]
			.start_time;
	}
	function getWordEndTime() {
		return currentMetadata.value.currentWordMetadata.characters[
			wordLength - 1
		].end_time;
	}
	function getWordDuration(): number {
		return (
			(new Date(
				currentMetadata.value.currentWordMetadata.characters[
					wordLength - 1
				].end_time
			) -
				new Date(
					currentMetadata.value.currentWordMetadata.characters[0].start_time
				)) /
			1000
		);
	}
	function getWordStatus(): WordLogStatus {
		for (let i = 0; i < wordLength; i++) {
			if (
				currentMetadata.value.currentWordMetadata
					.characters[i].status !== 'correct'
			)
				return 'error';
		}
		return 'correct';
	}
	function getWordWpm(): number {
		return parseFloat(
			(wordLength / 5 / (duration / 60)).toFixed(2)
		);
	}
	function insertWordLogs(): void {
		const updatedWordObject = {
			index,
			word,
			start_time: startTime,
			end_time: endTime,
			duration,
			status,
			type,
			wpm,
			session_id,
		};
		wordLogs.push(updatedWordObject);
	}
}

function incrementWordCount(): void {
	totalWordsCount++;
}

function insertWord(word: string) {
	collectedWords.push(word);
}

function handleAfkOrOutOfFocus() {
	resetEverything();
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
		correctCharIndex.value,
		0,
		{ character: key, log_time: 0, status: 'extra' }
	);
}

function resetAllSessionData() {
	const emptySession = {
		user_id: 0,
		start_time: '',
		difficulty: '',
		mode: '',
		game_metadata: {},
		end_time: '',
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
		dataset: '',
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
	currentIncorrect = false;
	collectedWords = [];
	characterLogs = [];
	wordLogs = [];
	intervalLogs = [];
	totalWordsCount = 0;
	totalCorrectsCount = 0;
	totalErrorsCount = 0;
	totalCharactersCount = 0;
	intervalCharacterCount = 0;
	characterCountPerFiveSeconds = [];
	chartData = { wpm: [], error: [], raw: [], time: [] };
}

function resetIndexes() {
	currentWordNum.value = 0;
	currentCharNum.value = 0;
	correctCharIndex.value = 0;
}

//db insert
function fillFinalData(time: number) {
	sessionsInsertData.total_characters = getTotalCharacters();
	const elapsedTime = time - startTime!;
	sessionsInsertData.total_errors = totalErrorsCount;
	sessionsInsertData.total_corrects = totalCorrectsCount;
	sessionsInsertData.wpm = getWpm(
		totalCorrectsCount + totalErrorsCount,
		elapsedTime
	);
	sessionsInsertData.accuracy = getAccuracy(
		totalCorrectsCount,
		totalCharactersCount
	);
	sessionsInsertData.raw = getRaw(totalCharactersCount, elapsedTime);
	sessionsInsertData.consistency = getConsistency(chartData);
	sessionsInsertData.end_time = new Date(time)
		.toISOString()
		.toLocaleString();
	if (selectedMode.value === 'word') {
		sessionsInsertData.duration = parseFloat(
			(elapsedTime / 1000).toFixed(2)
		);
	} else if (selectedMode.value === 'time') {
		sessionsInsertData.duration = selectedDuration.value;
	}
	sessionsInsertData.words = collectedWords;
	sessionsInsertData.total_words = getTotalWords();
	sessionsInsertData.xp_gains = parseFloat(
		(sessionsInsertData.accuracy / 10).toFixed(2)
	);

	if (selectedMode.value === 'word') {
		sessionsInsertData.logs = allData.value;
	} else if (selectedMode.value === 'time') {
		const currentWordIndexSumTwo =
			currentMetadata.value.currentWordMetadata.index + 2;
		sessionsInsertData.logs = spliceUntilIndex(
			allData.value,
			currentWordIndexSumTwo
		);
	}
	sessionsInsertData.chart_data = {};
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

function spliceUntilIndex(arr, index) {
	const spliceIndex = arr.findIndex((obj) => obj.index === index);
	return arr.splice(0, spliceIndex + 1);
}

function getAccuracy(corrects: number, totalCharacters: number) {
	return parseFloat(((corrects / totalCharacters) * 100).toFixed(2));
}

function getRaw(totalCharacters: number, elapsedTime: number) {
	return parseFloat(
		(totalCharacters / 5 / (elapsedTime / 1000 / 60)).toFixed(2)
	);
}

function getConsistency(chartData: ChartData) {
	const { wpm, raw } = chartData;
	const length = Math.min(wpm.length, raw.length);

	let sumRatios = 0;
	for (let i = 0; i < length; i++) {
		const ratio = Math.min(wpm[i] / raw[i], 1); // Limit the ratio to 1
		sumRatios += ratio;
	}

	const averageRatio = sumRatios / length;
	const consistencyPercentage = averageRatio * 100;
	return parseFloat(consistencyPercentage.toFixed(2));
}

async function insertSessionToDatabase() {
	const { data, error } = await client
		.from('sessions')
		.insert({ ...sessionsInsertData })
		.select();
	if (error) {
		console.error(error);
		return error;
	}
	return data;
}

async function insertLogsToDatabase() {
	const tempCharacterLogs = characterLogs;
	const tempWordLogs = wordLogs;
	const tempIntervalLogs = intervalLogs;
	try {
		const insertCharLogsPromise = client
			.from('character_logs')
			.insert(tempCharacterLogs);

		const insertWordLogsPromise = client
			.from('word_logs')
			.insert(tempWordLogs);

		const insertIntervalLogsPromise = client
			.from('interval_logs')
			.insert(tempIntervalLogs);

		const [charLogsResult, wordLogsResult, intervalLogsResult] =
			await Promise.all([
				insertCharLogsPromise,
				insertWordLogsPromise,
				insertIntervalLogsPromise,
			]);

		// Check for errors
		if (charLogsResult.error) {
			console.error(
				'Error inserting charLogs:',
				charLogsResult.error
			);
		}
		if (wordLogsResult.error) {
			console.error(
				'Error inserting wordLogs:',
				wordLogsResult.error
			);
		}
		if (intervalLogsResult.error) {
			console.error(
				'Error inserting wordLogs:',
				intervalLogsResult.error
			);
		}

		// Logs inserted successfully
		console.log('CharLogs inserted:', charLogsResult.data);
		console.log('WordLogs inserted:', wordLogsResult.data);
		console.log('IntervalLogs inserted:', intervalLogsResult.data);
	} catch (error) {
		console.error('Error inserting logs:', error);
	}
}

// ui functions
function changeDifficulty(e: Event) {
	const element = e.target as HTMLSelectElement;
	const difficulty = element.value as DifficultyOptions;
	selectedDifficulty.value = difficulty;
}

function changeKey(e: Event) {
	const element = e.target as HTMLSelectElement;
	const key = element.value;
	selectedKey.value = key;
}

// watcher to get frash data when any mode/settings changed
watch(
	[
		selectedDifficulty,
		selectedDuration,
		selectedKey,
		selectedMode,
		selectedDataset,
		selectedWords,
	],
	() => {
		fetchFreshWords();
	}
);

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
		resetIntervalCount();
	}
}

// Call the function initially to start the loop
function updateWPM() {
	if (!sessionRunning.value) {
		clearTimeout(timeoutId);
		resetIntervalCount();
		setIntervalValuesOnFinishedSession();
		return;
	}
	insertCharacterCountPerSecond();
	if (!startTime) {
		startTime = Date.now();
	}
	const elapsedTime = Date.now() - startTime;
	const logTime = Date.now();
	const wpm = getWpm(totalCorrectsCount + totalErrorsCount, elapsedTime);
	let rawWpm: number;
	if (intervalCount < 5) {
		rawWpm = getRaw(totalCharactersCount, elapsedTime);
	} else {
		rawWpm = getRaw(getTotalCharactersInLastFiveSeconds(), 5000);
	}
	setIntervalValues(wpm, intervalCount, rawWpm);
	insertChartDataLog(wpm, intervalError, intervalCount, rawWpm);
	pushIntervalLogs(wpm, intervalError, intervalCount, rawWpm, logTime);
	incrementIntervalCount();
	resetIntervalCharacterCount();
	resetIntervalError();
	timeoutId = setTimeout(updateWPM, 1000); // Log the values every second
	function setIntervalValuesOnFinishedSession() {
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
	}
}

function getTotalCharactersInLastFiveSeconds() {
	const lastFiveNumbers = characterCountPerFiveSeconds.slice(-5);
	const sum = lastFiveNumbers.reduce(
		(accumulator, currentValue) => accumulator + currentValue,
		0
	);
	return sum;
}

function insertCharacterCountPerSecond() {
	characterCountPerFiveSeconds.push(intervalCharacterCount);
}

function setIntervalValues(wpm: number, intervalCount: number, rawWpm: number) {
	liveTimer.value = intervalCount;
	liveRawWpm.value = rawWpm;
	liveWpm.value = wpm;
}

function insertChartDataLog(
	wpm: number,
	intervalError: number,
	intervalCount: number,
	rawWpm: number
) {
	chartData.wpm.push(wpm);
	chartData.error.push(intervalError);
	chartData.time.push(intervalCount);
	chartData.raw.push(rawWpm);
}

function pushIntervalLogs(
	wpm: number,
	errors: number,
	timeFromStart: number,
	raw: number,
	logTime: number
) {
	const characterIndex = currentMetadata.value.currentCorrectCharLocation;
	const wordIndex = currentMetadata.value.currentWordMetadata.index;
	let misses = 0;
	let sessionId: number;

	insertIntervalLogs();
	function insertIntervalLogs() {
		const updatedIntervalLogObject = {
			character_index: characterIndex,
			word_index: wordIndex,
			time_from_start: timeFromStart,
			wpm,
			session_id: sessionId,
			misses,
			errors,
			raw,
			log_time: new Date(logTime)
				.toISOString()
				.toLocaleString(),
		};
		intervalLogs.push(updatedIntervalLogObject);
	}
}

function incrementIntervalCount(): void {
	intervalCount++;
}

function resetIntervalError(): void {
	intervalError = 0;
}

function resetIntervalCharacterCount(): void {
	intervalCharacterCount = 0;
}

function resetIntervalCount(): void {
	intervalCount = 1;
}

//watch if input out of focus
watch(currentActive, () => {
	if (currentActive.value.id !== 'MasterInput') {
		handleAfkOrOutOfFocus();
	}
});

//initiate

// set caret position
onMounted(() => {
	requestAnimationFrame(setCaretPosition);

	function setCaretPosition() {
		const cursorKey = document.querySelector('.cursor-key');
		if (cursorKey?.getBoundingClientRect()) {
			const rect = cursorKey?.getBoundingClientRect();

			CARETLEFT.value = rect.left;
			CARETTOP.value = rect.top;
			currentActive.value = document.activeElement;
		}
		requestAnimationFrame(setCaretPosition);
	}
});

//redirect to login
watchEffect(async () => {
	if (!user.value) {
		router.push('/login');
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
		.from('profile')
		.select()
		.eq('user_id', userId)
		.single();
	if (error) {
		console.log(error);
		console.log(
			'no profile for users found. user needs to setup profile'
		);
	}
	if (data) {
		USERNAME.value = data.username;
		console.log(USERNAME.value);
	}
	return data;
}

// pure functions and checkers
function getTotalWords(): number {
	if (selectedMode.value === 'word') {
		return collectedWords.length;
	} else if (selectedMode.value === 'time') {
		return collectedWords.length;
	}
	console.log(`mode: ${selectedMode.value} not supported`);
	return 0;
}

function getTotalCharacters(): number {
	if (selectedMode.value === 'word') {
		return characterLogs.length;
	} else if (selectedMode.value === 'time') {
		return characterLogs.length;
	}
	console.log(`mode: ${selectedMode.value} not supported`);
	return 0;
}

function getDuration() {
	if (selectedMode.value === 'word') {
		return words.value?.num_words;
	} else if (selectedMode.value === 'time') {
		console.log('time not implemented yet');
		return totalWordsCount;
	}
	console.log('total words not found');
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
		metadata.currentCharLocation === 0 &&
		metadata.currentCorrectCharLocation === 0
	);
}

function isEndSession() {
	if (selectedMode.value === 'word') {
		const metadata = currentMetadata.value;
		const currentWordLocation = metadata.currentWordLocation;
		const currentCharLocation = metadata.currentCharLocation;
		const currentWordLength = metadata.currentWordLength;

		return (
			currentWordLocation === allData.value.length - 1 &&
			currentCharLocation === currentWordLength - 1
		);
	} else if (selectedMode.value === 'time') {
		return intervalCount === selectedDuration.value;
	} else {
		console.log(`${selectedMode.value} not supported`);
		return false;
	}
}

function isEndWord() {
	const currentCharLocation = currentMetadata.value.currentCharLocation;
	const currentWordLength = currentMetadata.value.currentWordLength;

	return currentCharLocation === currentWordLength - 1;
}
</script>
