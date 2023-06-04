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
			:start-display-index="currentStartDisplayWordIndex"
			:end-display-index="currentEndDisplayWordIndex"
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
import { ref, computed } from 'vue';
import {
	useHomeStore,
	KEYOPTIONS,
	DIFFICULTY,
	MODES,
	DATASETS,
} from '@/stores/home';
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
	SessionsInsert,
	CharacterLogsInsert,
	WordLogsInsert,
	IntervalLogsInsert,
} from '@/types';
import { calculateRawWPM, calculateWPM, focusInput } from '@/utils/input';
import type { Database } from '~/types/database.types';
import formatLocaleTime from '~/utils/format-locale-time';
import { IntervalCounter, BaseCounter } from '~/src/counters';
import { isKeySpace, isQuickRestartShortcut } from '~/src/helpers';
import { WordLog, CharacterLog, IntervalLog } from '~/src/log';

definePageMeta({
	middleware: 'auth',
});

//db & auth
const user = useSupabaseUser();
const client = useSupabaseClient<Database>();
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
	freedomMode,
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
const intervalCount = new IntervalCounter();
const liveWpm = ref(0);
const liveRawWpm = ref(0);
const liveTimer = ref(0);
const intervalError = new BaseCounter();
const intervalCharacterCount = new BaseCounter();
let characterCountPerFiveSeconds: number[] = [];
const totalCharactersCount = new BaseCounter();
const totalErrorsCount = new BaseCounter();
const totalCorrectsCount = new BaseCounter();
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

//manage caret
const CARETLEFT = ref(0);
const CARETTOP = ref(0);

// counters managing auto-scroll and infinite words
const lineCounter = ref(1);
const currentStartDisplayWordIndex = ref(0);
let startSecondLineWordIndex = 0;
const currentEndDisplayWordIndex = computed(() => {
	return currentStartDisplayWordIndex.value + 100;
});
let oldTop: number;

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
	const currentWordLength = allData.value[currentWordNum.value]
		?.characters.length as number;
	const currentChar =
		allData.value[currentWordNum.value]?.characters[
			currentCharNum.value
		]?.character;
	const currentCharMetadata =
		allData.value[currentWordNum.value]?.characters[
			currentCharNum.value
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
	let num = 100;
	if (selectedMode.value === 'word') {
		num = selectedWords.value ?? 10;
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
		console.error(
			'Error: fillData():\
			No all_data found from returned words.value\
			or words.value doesnt exist.'
		);
		return;
	}
	allData.value = JSON.parse(JSON.stringify(words.value.all_data));
}

function handleKeydown(e: KeyboardEvent) {
	if (loading.value || !allData.value.length) return;
	// tab used to start new game
	if (isQuickRestartShortcut(e)) {
		handleQuickRestart();
	} else if (isCtrlBackspace(e)) {
		handleCtrlBackspace();
	} else if (isBackspace(e)) {
		handleBackspace();
	} else if (isRestrictedKeys(e)) {
		console.log('Keydown unhandled! Restricted key: ', e.key);
	} else {
		handleInput(e);
	}
}

function handleSpace() {
	const metadata = currentMetadata.value;
	metadata.currentWordMetadata.status = getWordStatus();
	insertWord(metadata.currentWord);
	pushWordLogs();
	currentWordNum.value += 2;
	resetCharNum();
	resetCorrectCharIndex();
}

function handleQuickRestart() {
	sessionRunning.value = false;
	fetchWords();
}

function isFinalWord(index: number) {
	return (
		selectedMode.value === 'word' &&
		index === selectedWords.value - 1
	);
}

function handleInput(e: KeyboardEvent) {
	const { key } = e;
	const { currentCorrectChar, currentWordType, currentWordMetadata } =
		currentMetadata.value;
	const { index } = currentWordMetadata;

	if (isStartSession()) {
		handleStartSession();
	}
	if (currentWordType !== 'separator') {
		totalCharactersCount.increment();
		if (isKeySpace(e)) {
			if (!isFinalWord(index)) handleSpace();
			return;
		}
	}
	if (key === currentCorrectChar) {
		handleCorrectInput();
	} else {
		handleIncorrectInput(key);
	}
	finalKeydown = Date.now();
}

function handleCorrectInput() {
	intervalCharacterCount.increment();
	const { currentWordMetadata } = currentMetadata.value;
	if (currentWordMetadata && currentWordMetadata.type !== 'separator') {
		totalCorrectsCount.increment();
	}
	const metadata = currentMetadata.value;
	let currentCharMetadata = currentMetadata.value.currentCharMetadata;
	const time = Date.now();
	const duration = getCharDuration(time);
	let index = metadata.currentCharLocation;
	const wordIndex = metadata.currentWordMetadata.index;
	if(currentWordMetadata.type === 'separator'){
		currentCharMetadata = allData.value[currentWordNum.value]?.characters[
			metadata.currentCorrectCharLocation
		];
		index = metadata.currentCorrectCharLocation
	}

	updateCurrentCharacterObject();
	if (isEndSession()) {
		handleEndSession(time);
		return;
	} else if (isEndWord() || currentWordMetadata.type === 'separator') {
		handleEndWord();
	} else {
		incrementChar();
	}
	resetCorrectCharIndex();

	function updateCurrentCharacterObject() {
		currentCharMetadata.end_time = formatLocaleTime(time);
		currentCharMetadata.start_time = formatLocaleTime(finalKeydown);
		currentCharMetadata.status = 'correct';
		currentCharMetadata.duration = duration;
		currentCharMetadata.wpm = getCharWpm() ?? undefined;
	}
	function getCharWpm() {
		if (index === 0 && wordIndex === 0) {
			return null;
		}
		return parseFloat((60 / duration / 5).toFixed(2));
	}
}

function getCharDuration(time: number) {
	return (time - finalKeydown) / 1000;
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
	const { currentCharMetadata } = currentMetadata.value;
	const time = Date.now();
	const duration = getCharDuration(time);
	const { currentWordMetadata } = currentMetadata.value;
	totalErrorsCount.increment();
	intervalError.increment();
	if (currentWordMetadata.type === 'separator') {
		insertExtraChar(key);
		correctCharIndex.value++;
	} else {
		updateCurrentCharacterObject();
		if (isEndWord()) {
			handleEndWord();
		} else {
			incrementChar();
		}
		resetCorrectCharIndex();
	}

	function updateCurrentCharacterObject() {
		currentCharMetadata.end_time = formatLocaleTime(time);
		currentCharMetadata.start_time = formatLocaleTime(finalKeydown);
		currentCharMetadata.status = 'error';
		currentCharMetadata.duration = duration;
		currentCharMetadata.wpm = undefined;
		currentCharMetadata.input = key;
	}
}

// function to delete extra values
function deleteExtras(): void {
	const totalExtras = getExtrasCount();
	if (totalExtras <= 0) {
		return;
	}
	const metadata = currentMetadata.value;

	allData.value[metadata.currentWordLocation]?.characters.splice(
		metadata.currentCharLocation,
		totalExtras
	);
}

function getExtrasCount(): number {
	const metadata = currentMetadata.value;
	return (
		metadata.currentCorrectCharLocation -
		metadata.currentCharLocation
	);
}

function handleCtrlBackspace() {
	if (isStartSession()) return;
	const wordIndex = currentWordNum.value;
	const currentWordMetadata = currentMetadata.value.currentWordMetadata;
	for (let i = correctCharIndex.value; i >= 0; i--) {
		if (currentWordMetadata.characters[i].status === 'extra') {
			currentWordMetadata.characters.splice(i, 1);
		} else resetCharMetadata(wordIndex, i);
	}
	currentCharNum.value = 0;
	correctCharIndex.value = 0;
}

function resetCharMetadata(wordIndex: number, charIndex: number) {
	const updatedCharMetadata: CharacterMetadata = {
		character: allData.value[wordIndex].characters[charIndex]
			.character,
		index: charIndex,
		word_index: wordIndex,
		status: 'pending',
		input: undefined,
	};
	Object.assign(
		allData.value[wordIndex].characters[charIndex],
		updatedCharMetadata
	);
}

function handleBackspace() {
	if (isStartSession()) return;
	if (freedomMode.value === 'on') {
		handleBackspaceFreedomModeOn();
	} else {
		handleBackspaceFreedomModeOff();
	}
}

function handleBackspaceFreedomModeOff() {
	resetPrevCharMetadata();
	return;
}

function resetPrevCharMetadata() {
	const { currentWordMetadata } = currentMetadata.value;
	const currentWordIndex = currentWordMetadata.index;
	let prevCharIndex: number;
	let prevCharMetadata: CharacterMetadata;
	if (correctCharIndex.value === 0) {
		let prevWordMetadata: WordMetadata;
		let newWordIndex: number;
		if (currentWordMetadata.type === 'separator') {
			newWordIndex = currentWordNum.value - 1;
			prevWordMetadata = allData.value[newWordIndex];
		} else {
			newWordIndex = currentWordNum.value - 2;
			prevWordMetadata = allData.value[newWordIndex];
		}
		for (let i = 0; i < prevWordMetadata.characters?.length; i++) {
			if (
				allData.value[newWordIndex].characters[i]
					.status === 'pending'
			) {
				break;
			} else {
				prevCharIndex = i;
			}
		}
		prevCharMetadata =
			allData.value[newWordIndex].characters[prevCharIndex];
		if (prevCharMetadata.status === 'extra') {
			currentMetadata.value.currentWordMetadata.characters.splice(
				prevCharIndex,
				1
			);
		} else {
			prevCharMetadata.status = 'pending';
			delete prevCharMetadata.input;
			currentCharNum.value;
		}
		currentWordNum.value = newWordIndex;
		currentCharNum.value = prevCharIndex;
		correctCharIndex.value = currentCharNum.value;
	} else {
		prevCharIndex = correctCharIndex.value - 1;
		prevCharMetadata =
			currentMetadata.value.currentWordMetadata.characters[
				prevCharIndex
			];
		if (prevCharMetadata.status === 'extra') {
			currentMetadata.value.currentWordMetadata.characters.splice(
				prevCharIndex,
				1
			);
		} else {
			prevCharMetadata.status = 'pending';
			delete prevCharMetadata.input;
			currentCharNum.value--;
		}
		correctCharIndex.value--;
	}
}

function handleBackspaceFreedomModeOn() {
	console.log('handling backspace with freedom mode: on');
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
	fillCharacterLogs();
	if (metadata.currentWordMetadata.type !== 'separator') {
		insertWord(metadata.currentWord);
		pushWordLogs();
	}
	fillFinalIntervalValues(time);
	fillFinalData(time);
	sessionRunning.value = false;
	pastSessions.value = []; // clear it first
	pastSessions.value.push(JSON.parse(JSON.stringify(sessionsInsertData)));
	console.log('characterlogs: ', characterLogs);
	console.log('wordlogs: ', wordLogs);
	console.log('intervallogs: ', intervalLogs);
	// push to db
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

function fillCharacterLogs() {
	allData.value.forEach((wordObj) => {
		if (wordObj.type === 'separator') return;
		wordObj.characters?.forEach((charObj) => {
			if (
				charObj.status === 'pending' ||
				charObj.status === 'extra'
			)
				return;
			characterLogs.push(charObj);
		});
	});
}

function fillSessionIdToLogs() {
	addSessionIdToLogs(characterLogs);
	addSessionIdToLogs(wordLogs);
	addSessionIdToLogs(intervalLogs);
}

function addSessionIdToLogs(
	logs: CharacterLogsInsert[] | WordLogsInsert[] | IntervalLogsInsert[]
) {
	logs.forEach((log) => {
		log.session_id = sessionId;
	});
}

function fillFinalIntervalValues(time: number) {
	insertCharacterCountPerSecond();
	const elapsedTime = time - startTime!;
	let durationRaw;
	if (elapsedTime < 5000) {
		const wholeSeconds = Math.floor(elapsedTime / 1000);
		const differenceWithoutRemainder = wholeSeconds * 1000;
		durationRaw = (elapsedTime % 1000) + differenceWithoutRemainder;
	} else {
		durationRaw = (elapsedTime % 1000) + 4000;
	}
	const durationSeconds = parseFloat((elapsedTime / 1000).toFixed(2));
	const wpm = getWpm(
		totalCorrectsCount.getValue() + totalErrorsCount.getValue(),
		elapsedTime
	);
	const rawWpm = getRaw(
		getTotalCharactersInLastFiveSeconds(),
		durationRaw
	);
	if (selectedMode.value === 'word') {
		insertChartDataLog(
			wpm,
			intervalError.getValue(),
			durationSeconds,
			rawWpm
		);
	} else if (selectedMode.value === 'time') {
		insertChartDataLog(
			wpm,
			intervalError.getValue(),
			selectedDuration.value,
			rawWpm
		);
	}

	pushIntervalLogs(
		wpm,
		intervalError.getValue(),
		durationSeconds,
		rawWpm,
		time
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
	metadata.currentWordMetadata.status = getWordStatus();
	if (metadata.currentWordMetadata.type === 'word') {
		insertWord(metadata.currentWord);
		pushWordLogs();
	}
	incrementWord();
	resetCharNum();
}

function pushWordLogs() {
	//internal
	const wordLength = currentMetadata.value.currentWordLength;
	//to push
	const duration = getWordDuration();
	const wpm = getWordWpm();

	const newWordLog = new WordLog({
		index: getWordIndex(),
		word: currentMetadata.value.currentWord,
		type: getWordType(),
		start_time: getWordStartTime(),
		end_time: getWordEndTime(),
		duration,
		status: getWordStatus(),
		wpm,
	});

	if (wpm && duration) {
		wordLogs.push(newWordLog.getData());
	}

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
	function getWordWpm(): number {
		return parseFloat(
			(wordLength / 5 / (duration / 60)).toFixed(2)
		);
	}
}

function getWordStatus(): WordLogStatus {
	const wordLength = currentMetadata.value.currentWordLength;
	for (let i = 0; i < wordLength; i++) {
		if (
			currentMetadata.value.currentWordMetadata.characters[i]
				.status !== 'correct'
		)
			return 'error';
	}
	return 'correct';
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
		{ character: key, status: 'extra' }
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
	collectedWords = [];
	characterLogs = [];
	wordLogs = [];
	intervalLogs = [];
	intervalError.reset();
	totalCorrectsCount.reset();
	totalErrorsCount.reset();
	totalCharactersCount.reset();
	intervalCharacterCount.reset();
	characterCountPerFiveSeconds = [];
	lineCounter.value = 1;
	oldTop = 0;
	currentStartDisplayWordIndex.value = 0;
	startSecondLineWordIndex = 0;
	chartData = { wpm: [], error: [], raw: [], time: [] };
}

function resetIndexes() {
	currentWordNum.value = 0;
	currentCharNum.value = 0;
	correctCharIndex.value = 0;
}

//db insert
function fillFinalData(time: number) {
	const totalCharacters = getTotalCharacters(); // infer total characters from length
	sessionsInsertData.total_characters = totalCharacters;
	const elapsedTime = time - startTime!;
	sessionsInsertData.total_errors = totalErrorsCount.getValue();
	sessionsInsertData.total_corrects = totalCorrectsCount.getValue();
	sessionsInsertData.wpm = getWpm(
		totalCorrectsCount.getValue() + totalErrorsCount.getValue(),
		elapsedTime
	);
	sessionsInsertData.accuracy = getAccuracy(
		totalCorrectsCount.getValue(),
		totalCharacters
	);
	sessionsInsertData.raw = getRaw(totalCharacters, elapsedTime);
	sessionsInsertData.consistency = getConsistency(chartData);
	sessionsInsertData.end_time = formatLocaleTime(time);
	sessionsInsertData.duration = getDuration(elapsedTime);
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

function spliceUntilIndex(arr: WordMetadata[], index: number) {
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
		.insert(sessionsInsertData)
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
	} catch (error) {
		console.error('Error inserting logs:', error);
	}
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
		intervalCount.reset();
	}
}

// Call the function initially to start the loop
function updateWPM() {
	if (!sessionRunning.value) {
		clearTimeout(timeoutId);
		intervalCount.reset();
		setIntervalValuesOnFinishedSession();
		return;
	}
	if (!startTime) {
		startTime = Date.now();
	}
	const logTime = Date.now();
	const elapsedTime = logTime - startTime;
	if (
		selectedMode.value === 'time' &&
		elapsedTime >= selectedDuration.value * 1000
	) {
		intervalCount.increment();
		handleEndSession(logTime);
		return;
	}
	const wpm = getWpm(
		totalCorrectsCount.getValue() + totalErrorsCount.getValue(),
		elapsedTime
	);
	let rawWpm: number;
	if (intervalCount.getValue() < 5) {
		rawWpm = getRaw(totalCharactersCount.getValue(), elapsedTime);
	} else {
		rawWpm = getRaw(getTotalCharactersInLastFiveSeconds(), 5000);
	}
	insertCharacterCountPerSecond();
	setIntervalValues(wpm, intervalCount.getValue(), rawWpm);
	insertChartDataLog(
		wpm,
		intervalError.getValue(),
		intervalCount.getValue(),
		rawWpm
	);
	pushIntervalLogs(
		wpm,
		intervalError.getValue(),
		intervalCount.getValue(),
		rawWpm,
		logTime
	);
	intervalCount.increment();
	intervalCharacterCount.reset();
	intervalError.reset();
	timeoutId = setTimeout(updateWPM, 1000); // Log the values every second
}

function setIntervalValuesOnFinishedSession() {
	if (pastSessions.value.length) {
		liveRawWpm.value =
			pastSessions.value[pastSessions.value.length - 1].raw;
		liveWpm.value =
			pastSessions.value[pastSessions.value.length - 1].wpm;
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
	characterCountPerFiveSeconds.push(intervalCharacterCount.getValue());
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
	const misses = 0;
	let sessionId: number;

	const updatedIntervalLogObject = {
		character_index: characterIndex,
		word_index: wordIndex,
		time_from_start: timeFromStart,
		wpm,
		session_id: sessionId,
		misses,
		errors,
		raw,
		log_time: new Date(logTime).toISOString().toLocaleString(),
	};
	intervalLogs.push(updatedIntervalLogObject);
}

// watcher to get fresh data when any mode/settings changed
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
			if (!oldTop) {
				oldTop = CARETTOP.value;
			}
			currentActive.value = document.activeElement;
		}
		requestAnimationFrame(setCaretPosition);
	}
});

watch([CARETTOP], () => {
	if (CARETTOP.value > oldTop && oldTop !== 0) {
		handleNewLine();
	}
	oldTop = CARETTOP.value;
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
	}
	return data;
}

// pure functions and checkers
function getTotalWords(): number {
	if (selectedMode.value === 'word' && selectedWords.value) {
		return selectedWords.value;
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

function getDuration(elapsedTime: number) {
	if (selectedMode.value === 'word') {
		return parseFloat((elapsedTime / 1000).toFixed(2));
	} else {
		return selectedDuration.value as number;
	}
}

function isRestrictedKeys(e: KeyboardEvent) {
	return (
		(e.keyCode >= 9 && e.keyCode <= 27) ||
		(e.keyCode >= 33 && e.keyCode <= 45) ||
		(e.keyCode >= 91 && e.keyCode <= 93) ||
		(e.keyCode >= 112 && e.keyCode <= 183)
	);
}

function isCtrlBackspace(e: KeyboardEvent) {
	return e.ctrlKey && (e.keyCode === 8 || e.keyCode === 46);
}

function isBackspace(e: KeyboardEvent) {
	return e.keyCode === 8 || e.keyCode === 46;
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
	return isEndSessionModeWord();
}

function isEndSessionModeWord() {
	const metadata = currentMetadata.value;
	const currentWordLocation = metadata.currentWordLocation;
	const currentCharLocation = metadata.currentCharLocation;
	const currentWordLength = metadata.currentWordLength;

	return (
		currentWordLocation === allData.value.length - 1 &&
		currentCharLocation === currentWordLength - 1
	);
}

function isEndWord() {
	const currentCharLocation = currentMetadata.value.currentCharLocation;
	const currentWordLength = currentMetadata.value.currentWordLength;

	return currentCharLocation === currentWordLength - 1;
}

function handleNewLine() {
	lineCounter.value += 1;
	console.log(lineCounter.value);
	if (lineCounter.value >= 2) {
		currentStartDisplayWordIndex.value = startSecondLineWordIndex;
		console.log(currentStartDisplayWordIndex.value);
	}
	startSecondLineWordIndex =
		currentMetadata.value.currentWordMetadata.index;
}
</script>
