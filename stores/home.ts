import { WritableComputedRef } from "vue";
import { defineStore } from "pinia";
import type {
	DifficultyOptions,
	ModesOptions,
	ConfigDurationOptions,
	ConfigTotalWordsOptions,
	ConfigSelectionOptions,
	CharLogStatus,
} from "@/types";

//static options
export const KEYOPTIONS = [
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

export const DIFFICULTY: DifficultyOptions[] = [
	"easy",
	"medium",
	"hard",
	"extra_hard",
];
export const MODES: ModesOptions[] = ["word", "time"];
export const DATASETS: ConfigSelectionOptions[] = [
	"english_50k",
	"supabase-docs",
	"supabase code",
];

export const useHomeStore = defineStore("counter", () => {
	const settings = ref([
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
					option: ["word", "time", "infinity"],
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
					description:
						"The duration of the tests.",
					selected: 10,
					option: [10, 20, 30, 60],
					type: "tab",
				},
				{
					title: "Dataset",
					description:
						"The source of the words that are selected.",
					selected: "english_5k",
					option: [
						"english_5k",
						"english_50k",
						"code",
					],
					type: "select",
				},
				{
					title: "Key",
					description:
						"Select a key to prioritize. If a value is selected, each selected words will contain the selected key.",
					selected: "",
					option: [
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
				{
					title: "Sifu mode",
					description:
						"Restart if there is a single error",
					selected: "off",
					option: ["on", "off"],
					type: "tab",
				},
				{
					title: "Min WPM",
					description:
						"Automatically fails a test if your WPM falls below a threshold.",
					selected: "off",
					option: ["on", "off"],
					type: "tab",
				},
				{
					title: "Min accuracy",
					description:
						"Automatically fails a test if your accuracy falls below a threshold.",
					selected: "off",
					option: ["on", "off"],
					type: "tab",
				},
				{
					title: "Min burst",
					description:
						"Automatically fails a test if your raw for a single word falls below this threshold.",
					selected: "off",
					option: ["off", "fixed", "flex"],
					type: "tab",
				},
				{
					title: "Auto restart",
					description:
						"Automatically opens a new session upon finished.",
					selected: "on",
					option: ["on", "off"],
					type: "tab",
				},
				{
					title: "Quick restart",
					description:
						"Enables quickly restarting a new session with entering a key.",
					selected: "Tab",
					option: ["Tab", "Esc", "off"],
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
				{
					title: "Freedom mode",
					description:
						"Allow you to delete any characters including correct ones",
					selected: "off",
					option: ["on", "off"],
					type: "tab",
				},
				{
					title: "Opposite shift mode",
					description:
						"Allow you to delete any characters including correct ones",
					selected: "off",
					option: ["on", "off"],
					type: "tab",
				},
				{
					title: "Confidence mode",
					description:
						"Allow you to delete any characters including correct ones",
					selected: "off",
					option: ["on", "off"],
					type: "tab",
				},
			],
		},
		{
			tab: "Appearance",
			settings: [
				{
					title: "Smooth caret",
					description:
						"The caret will move smoothly between letters and words.",
					selected: "on",
					option: ["on", "off"],
					type: "tab",
				},
				{
					title: "Caret style",
					description:
						"Change the style of the caret during the test.",
					selected: "|",
					option: ["off", "|", "▮", "▯", "_"],
					type: "tab",
				},
				{
					title: "Set spacer style",
					description:
						"Change the appearance of spacer during the test.",
					selected: "off",
					option: ["on", "off"],
					type: "tab",
				},
				{
					title: "Font size",
					description:
						"Change the font size of the test words.",
					selected: 16,
					option: [
						12, 13, 14, 15, 16, 17, 18, 19,
						20, 21, 22, 23, 24,
					],
					type: "select",
				},
				{
					title: "Font family",
					description: "Change font family.",
					selected: "off",
					option: ["on", "off"],
					type: "tab",
				},
				{
					title: "Page width",
					description:
						"This enables using space to skip the words.",
					selected: "md",
					option: ["sm", "md", "lg"],
					type: "tab",
				},
				{
					title: "Timer",
					description:
						"Displays a live timer for timed tests and progress for words/custom tests.",
					selected: "on",
					option: ["on", "off"],
					type: "tab",
				},
				{
					title: "Live WPM",
					description:
						"Displays a live WPM speed during the test. Updates once every second.",
					selected: "on",
					option: ["on", "off"],
					type: "tab",
				},
				{
					title: "Live accuracy",
					description:
						"Displays live accuracy during the test.",
					selected: "on",
					option: ["on", "off"],
					type: "tab",
				},
				{
					title: "Caps lock warning",
					description:
						"Displays a warning when caps lock is on.",
					selected: "off",
					option: ["on", "off"],
					type: "tab",
				},
			],
		},
	]);

	const difficulty: WritableComputedRef<DifficultyOptions> = computed({
		get: (): DifficultyOptions => {
			return settings.value[0].settings.find(
				(i) => i.title === "Difficulty"
			)!.selected as DifficultyOptions;
		},
		set: (newValue): void => {
			settings.value[0].settings.find(
				(i) => i.title === "Difficulty"
			)!.selected = newValue;
		},
	});
	const duration: WritableComputedRef<ConfigDurationOptions> = computed({
		get: (): ConfigDurationOptions => {
			return settings.value[0].settings.find(
				(i) => i.title === "Duration"
			)!.selected as ConfigDurationOptions;
		},
		set: (newValue): void => {
			settings.value[0].settings.find(
				(i) => i.title === "Duration"
			)!.selected = parseInt(newValue);
		},
	});
	const words: WritableComputedRef<ConfigTotalWordsOptions> = computed({
		get: (): ConfigTotalWordsOptions => {
			return settings.value[0].settings.find(
				(i) => i.title === "Total words"
			)!.selected as ConfigTotalWordsOptions;
		},
		set: (newValue): void => {
			settings.value[0].settings.find(
				(i) => i.title === "Total words"
			)!.selected = parseInt(newValue);
		},
	});
	const mode: WritableComputedRef<ModesOptions> = computed({
		get: (): ModesOptions => {
			return settings.value[0].settings.find(
				(i) => i.title === "Mode"
			)!.selected as ModesOptions;
		},
		set: (newValue): void => {
			settings.value[0].settings.find(
				(i) => i.title === "Mode"
			).selected = newValue;
		},
	});
	const key: WritableComputedRef<string> = computed({
		get: (): string => {
			return settings.value[0].settings.find(
				(i) => i.title === "Key"
			)!.selected as string;
		},
		set: (newValue): void => {
			settings.value[0].settings.find(
				(i) => i.title === "Key"
			).selected = newValue;
		},
	});
	const dataset: WritableComputedRef<ConfigSelectionOptions> = computed({
		get: (): ConfigSelectionOptions => {
			return settings.value[0].settings.find(
				(i) => i.title === "Key"
			)!.selected as ConfigSelectionOptions;
		},
		set: (newValue): void => {
			settings.value[0].settings.find(
				(i) => i.title === "Key"
			).selected = newValue;
		},
	});

	// local settings
	const maxExtraWords = ref(NaN);
	const allowSkipWords = ref(false);
	const allowSkipExtras = ref(true);
	const skipIncorrectWords = ref(false);
	const forgiveSkipCharacters = ref(false);

	// display
	const showLiveWPM = ref(false);
	const showTimerProgress = ref(false);
	const punctuation = ref(false);
	const numbers = ref(false);

	return {
		difficulty,
		duration,
		words,
		mode,
		key,
		dataset,
		maxExtraWords,
		allowSkipExtras,
		allowSkipWords,
		skipIncorrectWords,
		forgiveSkipCharacters,
		showLiveWPM,
		showTimerProgress,
		punctuation,
		numbers,
		settings,
	};
});
