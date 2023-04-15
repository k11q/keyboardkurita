import { WritableComputedRef } from "vue";
import { defineStore } from "pinia";

export type DifficultyOptions = "easy" | "medium" | "hard" | "extra_hard";
export type ModesOptions = "word" | "time";
export type ConfigDurationOptions = 10 | 20 | 30 | 60 | undefined;
export type ConfigTotalWordsOptions = 10 | 25 | 50 | undefined;
export type ConfigSelectionOptions =
	| "english_50k"
	| "supabase-docs"
	| "supabase code";
export type CharLogStatus = "error" | "correct" | "pending" | "extra";
export type KeystrokeLog = {
	character: string;
	time: number;
	status: CharLogStatus;
};
export type WordType = "separator" | "word";

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
					option: ["time", "word"],
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
					description: "Restart if there is one",
					selected: "off",
					option: ["on", "off"],
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
			],
		},
		{
			tab: "Keyboard",
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
			],
		},
		{
			tab: "Appearance",
			settings: [
				{
					title: "Set carot style",
					description:
						"This enables using space to skip the words.",
					selected: "on",
					option: ["on", "off", "off", "off"],
					type: "tab",
				},
				{
					title: "Set spacer style",
					description:
						"Cursor will stop at error until you enter the correct character.",
					selected: "off",
					option: ["on", "off"],
					type: "tab",
				},
				{
					title: "Set font size",
					description:
						"Incorrect input will skip the character and move to the next.",
					selected: "off",
					option: ["on", "off"],
					type: "tab",
				},
				{
					title: "Set font",
					description:
						"This enables using space to skip the words.",
					selected: "off",
					option: ["on", "off"],
					type: "tab",
				},
			],
		},
	]);

	const difficulty: WritableComputedRef<DifficultyOptions> = computed(
		{
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
		}
	);
	const duration: WritableComputedRef<ConfigDurationOptions> = computed(
		{
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
		}
	);
	const words: WritableComputedRef<ConfigTotalWordsOptions> = computed(
		{
			get: (): ConfigTotalWordsOptions => {
				return settings.value[0].settings.find(
					(i) => i.title === "Total Words"
				)!.selected as ConfigTotalWordsOptions;
			},
			set: (newValue): void => {
				settings.value[0].settings.find(
					(i) => i.title === "Total Words"
				).selected = parseInt(newValue);
			},
		}
	);
	const mode: WritableComputedRef<ModesOptions> = computed(
		{
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
		}
	);
	const key: WritableComputedRef<string> = computed(
		{
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
		}
	);
	const dataset: WritableComputedRef<ConfigSelectionOptions> = computed(
		{
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
		}
	);

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
