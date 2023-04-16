<template>
	<div class="pb-10 px-10 pt-8 max-w-6xl w-full">
		<div
			v-if="
				currentActive &&
				currentActive.id === 'MasterInput'
			"
			:class="`fixed z-50 h-11 w-1.5 bg-[#3992FF] transition-all duration-100 ease-linear`"
			:style="`left: ${CAROTLEFT - 3}px; top: ${
				CAROTTOP - 2
			}px`"
		></div>
		<div
			:class="`flex flex-col items-center gap-6 fixed h-fit left-0 right-0 px-10 transition-all z-10 ease-in-out duration-400 ${
				currentActive &&
				currentActive.id === 'MasterInput'
					? 'bottom-10 mt-0'
					: 'top-1/2 -mt-52'
			} ${
				sessionRunning &&
				currentActive.id === 'MasterInput'
					? 'translate-y-[20rem]'
					: 'opacity-100 translate-y-0'
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
				class="text-neutral-300 hover:text-white cursor-pointer px-6 py-8 rounded-lg text-xl font-mono"
			>
				<span class="mr-4"
					><Icon
						name="lucide:mouse-pointer-click"
						size="1.5rem"
				/></span>

				<span>click to activate</span>
			</div>
			<div
				class="bg-neutral-800 border-neutral-700 border mb-5 px-6 py-2 h-14 rounded-full text-xs items-center flex justify-between relative max-w-4xl w-full"
			>
				<div class="flex gap-3 items-center col-span-2">
					<div>Difficulty:</div>
					<div class="relative">
						<select
							:value="
								selectedDifficulty
							"
							@change="
								changeDifficulty(
									$event
								)
							"
							class="text-base relative w-32 rounded-xl bg-neutral-700/50 hover:bg-neutral-700 border-neutral-600 border transition-all cursor-pointer py-2 pl-[10px] pr-10 text-left focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm"
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
							class="text-base relative w-32 rounded-xl bg-neutral-700/50 hover:bg-neutral-700 border-neutral-600 border transition-all cursor-pointer py-2 pl-[10px] pr-10 text-left focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm"
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
								changeKey(
									$event
								)
							"
							:value="selectedKey"
							class="text-base relative w-32 rounded-xl bg-neutral-700/50 hover:bg-neutral-700 border-neutral-600 border transition-all cursor-pointer py-2 pl-[10px] pr-10 text-left focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm"
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
						class="text-sm pl-3 pr-4 py-2 rounded-xl bg-neutral-700/50 hover:bg-neutral-700 border-neutral-600 border transition-all cursor-pointer"
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
			<div
				class="flex flex-col justify-center px-6"
				v-show="
					!currentActive ||
					(currentActive &&
						currentActive.id !==
							'MasterInput')
				"
			>
				<div v-if="pastSessions.length" class="pb-10 flex flex-col gap-2">
					<div class="flex gap-6">
						<div
							class="w-34 flex-none flex flex-col gap-2"
						>
							<div
								class="flex flex-col h-1/2"
							>
								<div
									class="text-2xl text-neutral-500"
								>
									wpm
								</div>
								<div
									class="text-[2.5rem] leading-tight font-mono text-[#6BD968]"
								>
									{{
										currentSelectionData.wpm
									}}
								</div>
							</div>
							<div
								class="flex flex-col"
							>
								<div
									class="text-2xl text-neutral-500"
								>
									acc
								</div>
								<div
									class="text-[2.5rem] leading-tight font-mono text-[#6BD968]"
								>
									{{
										currentSelectionData?.accuracy
									}}%
								</div>
							</div>
						</div>
						<ClientOnly
							><ResultsChart
								:data="
									currentSelectionData.chart_data
								"
						/></ClientOnly>
					</div>
					<div class="grid grid-cols-5 gap-6">
						<div class="flex flex-col gap-1">
							<div
								class="text-base text-neutral-500"
							>
								type
							</div>
							<div
								class="text-base leading-tight font-mono text-[#6BD968]"
							>
							<div>{{
									currentSelectionData?.mode
								}}</div>
								<div>{{
									currentSelectionData?.difficulty
								}}</div>
							</div>
						</div>
						<div class="flex flex-col gap-1">
							<div
								class="text-base text-neutral-500"
							>
								raw
							</div>
							<div
								class="text-2xl leading-tight font-mono text-[#6BD968]"
							>
							<div>{{
									currentSelectionData?.raw
								}}</div>
								
							</div>
						</div>
						<div class="flex flex-col gap-1">
							<div
								class="text-base text-neutral-500"
							>
								characters
							</div>
							<div
								class="text-2xl leading-tight font-mono text-[#6BD968]"
							>
								{{
									currentSelectionData?.total_corrects
								}}/{{
									currentSelectionData?.total_errors
								}}/{{
									currentSelectionData?.total_extras
								}}/{{
									currentSelectionData?.total_missed
								}}
							</div>
						</div>
						<div class="flex flex-col gap-1">
							<div
								class="text-base text-neutral-500"
							>
								consistency
							</div>
							<div
								class="text-2xl leading-tight font-mono text-[#6BD968]"
							>
								{{
									currentSelectionData?.consistency
								}}
							</div>
						</div>
						<div class="flex flex-col gap-1">
							<div
								class="text-base text-neutral-500"
							>
								time
							</div>
							<div
								class="text-2xl leading-tight font-mono text-[#6BD968]"
							>
								{{
									currentSelectionData?.duration
								}}s
							</div>
						</div>
					</div>
				</div>

				<div
					class="rounded-lg border border-neutral-700 w-full overflow-clip"
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
							<div
								class="text-[#6BD968]"
							>
								{{
									session.wpm.toFixed(
										1
									)
								}}
							</div>
						</div>
						<div>
							<div
								class="tabular-nums"
							>
								{{
									session.raw.toFixed(
										1
									)
								}}
							</div>
						</div>
						<div>
							<div
								class="tabular-nums"
							>
								{{
									session.accuracy.toFixed(
										1
									)
								}}
							</div>
						</div>
						<div>
							<div
								class="tabular-nums"
							>
								{{
									session.consistency.toFixed(
										1
									)
								}}
							</div>
						</div>
						<div>
							<div
								class="tabular-nums"
							>
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
							<div>
								{{
									session.mode
								}}
							</div>
						</div>
						<div class="col-span-2">
							<div
								class="tabular-nums line-clamp-1"
							>
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
			:class="`pointer-events-none fixed flex items-center justify-center top-1/2 -translate-y-1/2 font-mono transition-all ease-linear duration-1000 rounded-[32px] w-full left-0 right-0 text-4xl leading-[54px]`"
		>
			<div
				class="w-full max-w-6xl px-14 pt-6 mb-20 h-[14rem] flex-none"
				@click.prevent.stop="
					currentActive &&
					currentActive.id === 'MasterInput'
						? ''
						: focusInput()
				"
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
								char.character ===
								" "
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
					class="inset-0 absolute right-0 items-center justify-center flex cursor-pointer backdrop-blur bg-neutral-900/80 rounded-[32px]"
				></div>
			</div>
		</div>
		<input
			type="text"
			id="MasterInput"
			@keydown="handleKeydown"
			style="opacity: 0%; position: absolute"
		/>
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
	CharacterMetadata,
	WordMetadata,
	WordType,
	ChartData,
	CharacterPerformance,
	InputMetadata,
	KeystrokeLog,
} from "@/types";
import { calculateRawWPM, calculateWPM, focusInput } from "@/utils/input";

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
let totalExtrasCount = 0;

//
const currentActive = ref();
const allData: globalThis.Ref<WordMetadata[]> = ref([]);
const currentWordNum = ref(0);
const currentCharNum = ref(0);
const currentPendingWordIndex = ref(0);
const words = ref();

//
let startTime: number;
let endTime: number;
let currentIncorrect = false;
let finalKeydown = Date.now();

// ui states
const isOpen = useState("isOpen", () => false);
const loading = ref(false);
const currentSelection: globalThis.Ref<WordMetadata[]> = ref();
const currentSelectionData = computed(() => {
	if (pastSessions.value.length) {
		return pastSessions.value[pastSessions.value.length - 1];
	} else {
		return undefined;
	}
});

//manage carot
const CAROTLEFT = ref(0);
const CAROTTOP = ref(0);

//temporary placeholder for db
const pastSessions: globalThis.Ref<SessionsInsert[]> = ref([]);

// miscs
let timeoutId: NodeJS.Timeout;

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

async function fetchWords(char = "") {
	loading.value = true;
	if (char) {
		selectedKey.value = char.charAt(0);
	}
	resetEverything();
	if (words.value && words.value.next_data) {
		words.value = words.value.next_data;
		setupData();
		words.value.next_data = await fetchWordsAndReturn();
	} else {
		words.value = await fetchWordsAndReturn();
		setupData();
	}
}

async function fetchFreshWords(char = "") {
	loading.value = true;
	if (char) {
		selectedKey.value = char.charAt(0);
	}
	resetEverything();
	words.value = await fetchWordsAndReturn();
	setupData();
}

async function fetchWordsAndReturn() {
	const { data } = await useFetch(
		`api/words?char=${selectedKey.value.charAt(0)}&difficulty=${
			selectedDifficulty.value
		}&num=${selectedWords.value}`
	);
	return data.value;
}

function resetEverything() {
	resetIndexes();
	resetAllSessionData();
	resetCounters();
}

function setupData() {
	fillData();
	focusInput();
	loading.value = false;
}

function fillData() {
	if (!words.value || !words.value.all_data) {
		console.log(
			"Error: fillData(): No all_data found from returned words.value or words.value doesnt exist."
		);
		return;
	}
	allData.value = JSON.parse(JSON.stringify(words.value.all_data));
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

	if (isStartSession()) {
		handleStartSession();
	}
	finalKeydown = Date.now();
	incrementTotalCharactersCount();
	pushCharacterPerformance(key);
	if (key === currentCorrectChar) {
		handleCorrectInput();
	} else {
		handleIncorrectInput(key);
	}
}

function incrementTotalCharactersCount() {
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
	const corrects = getCorrects(currentCharacterObject, key);
	const count = getCount(currentCharacterObject);
	const errors = getError(currentCharacterObject);
	const wpm = getWpm();
	let session_id: number; // fill at the end

	upsertCharacterPerformance();

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

function getCorrects(characterObject: CharacterPerformanceInsert, key: string) {
	const currentCorrectChar = currentMetadata.value.currentCorrectChar;
	let corrects = characterObject ? characterObject.corrects : 0;
	return key === currentCorrectChar ? corrects + 1 : corrects;
}

function getCount(characterObject?: CharacterPerformanceInsert) {
	return characterObject ? characterObject.count + 1 : 1;
}
function getError(characterObject?: CharacterPerformanceInsert) {
	let error = characterObject ? characterObject.errors | 0 : 0;
	return currentIncorrect ? error : error + 1;
}

function handleCorrectInput() {
	const time = Date.now();

	incrementIntervalCharacterCount();
	deleteExtras();
	setTiming(time);
	incrementTotalCorrectsCount();
	setStatus();
	if (isEndSession()) {
		handleEndSession(time);
		fetchWords(selectedKey.value);
		return;
	} else if (isEndWord()) {
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

function setTiming(time: number) {
	currentCharacterTiming.value = isStartSession()
		? 0
		: (time - finalKeydown) / 1000;
}

function setStatus() {
	if (currentIncorrect) {
		currentCharacterStatus.value = "error";
		currentIncorrect = false;
	} else {
		currentCharacterStatus.value = "correct";
	}
}

function incrementTotalCorrectsCount() {
	const currentWordMetadata = currentMetadata.value.currentWordMetadata;
	if (
		!currentIncorrect &&
		currentWordMetadata &&
		currentWordMetadata.type !== "separator"
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

function updatePendingWordIndex() {
	currentPendingWordIndex.value = currentCharNum.value;
}

function handleIncorrectInput(key: string): void {
	incrementTotalErrorsCount();
	incrementIntervalError();
	currentIncorrect = true;
	insertExtraChar(key);
	currentPendingWordIndex.value++;
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
	incrementWordCount();
	resetCharNum();
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
	totalWordsCount = 0;
	totalCorrectsCount = 0;
	totalErrorsCount = 0;
	totalCharactersCount = 0;
	intervalCharacterCount = 0;
	characterCountPerFiveSeconds = [];
	Object.assign(chartData, { wpm: [], error: [], raw: [], time: [] });
}

function resetIndexes() {
	currentWordNum.value = 0;
	currentCharNum.value = 0;
	currentPendingWordIndex.value = 0;
}

//db insert
function fillFinalData(time: number) {
	const extras = sessionsInsertData.total_extras;
	sessionsInsertData.total_characters = getTotalCharacters();
	const elapsedTime = time - startTime;
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
		(totalCharacters / 5 / (elapsedTime / 1000 / 60)).toFixed(2)
	);
}

function getConsistency(chartData: ChartData) {
	const { wpm, raw } = chartData;
	const length = Math.min(wpm.length, raw.length);

	let sumRatios = 0;
	for (let i = 0; i < length; i++) {
		const ratio = wpm[i] / raw[i];
		sumRatios += ratio;
	}

	const averageRatio = sumRatios / length;
	const consistencyPercentage = averageRatio * 100;
	return parseFloat(consistencyPercentage.toFixed(2));
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
watch([selectedDifficulty, selectedDuration, selectedKey, selectedMode], () => {
	fetchFreshWords();
});

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
	const wpm = getWpm(totalCorrectsCount + totalErrorsCount, elapsedTime);
	let rawWpm: number;
	if (intervalCount < 5) {
		rawWpm = getRaw(totalCharactersCount, elapsedTime);
	} else {
		rawWpm = getRaw(getTotalCharactersInLastFiveSeconds(), 5000);
	}

	setIntervalValues(wpm, intervalCount, rawWpm);
	insertChartDataLog(wpm, intervalError, intervalCount, rawWpm);
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
	if (currentActive.value.id !== "MasterInput") {
		handleAfkOrOutOfFocus();
	}
});

// set caret position
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
		console.log(
			"no profile for users found. user needs to setup profile"
		);
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

function getDuration() {
	if (selectedMode.value === "word") {
		return words.value?.num_words;
	} else if (selectedMode.value === "time") {
		console.log("time not implemented yet");
		return totalWordsCount;
	}
	console.log("total words not found");
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
</script>
