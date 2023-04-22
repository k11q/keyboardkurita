import { WritableComputedRef } from 'vue';
import { defineStore } from 'pinia';
import type {
	DifficultyOptions,
	ModesOptions,
	ConfigDurationOptions,
	ConfigTotalWordsOptions,
	ConfigSelectionOptions,
	CharLogStatus,
} from '@/types';

//static options
export const KEYOPTIONS = [
	'',
	'a',
	'b',
	'c',
	'd',
	'e',
	'f',
	'g',
	'h',
	'i',
	'j',
	'k',
	'l',
	'm',
	'n',
	'o',
	'p',
	'q',
	'r',
	's',
	't',
	'u',
	'v',
	'w',
	'x',
	'y',
	'z',
];

export const DIFFICULTY: DifficultyOptions[] = [
	'easy',
	'medium',
	'hard',
	'extra_hard',
];
export const MODES: ModesOptions[] = ['word', 'time'];
export const DATASETS: ConfigSelectionOptions[] = [
	'english_50k',
	'supabase-docs',
	'supabase code',
];

export const listLanguageOptions = [
	'afrikaans',
	'afrikaans_10k',
	'afrikaans_1k',
	'albanian',
	'albanian_1k',
	'amharic',
	'arabic',
	'arabic_10k',
	'armenian_western',
	'armenian_western_1k',
	'azerbaijani',
	'azerbaijani_1k',
	'bangla',
	'bangla_10k',
	'bangla_letters',
	'belarusian_1k',
	'britishenglish',
	'bulgarian',
	'catalan',
	'catalan_1k',
	'chinese_traditional',
	'code_arduino',
	'code_assembly',
	'code_bash',
	'code_brainfck',
	'code_c++',
	'code_c',
	'code_csharp',
	'code_css',
	'code_dart',
	'code_elixir',
	'code_fsharp',
	'code_gdscript',
	'code_go',
	'code_haskell',
	'code_html',
	'code_java',
	'code_javascript',
	'code_javascript_1k',
	'code_julia',
	'code_kotlin',
	'code_latex',
	'code_lua',
	'code_luau',
	'code_matlab',
	'code_nim',
	'code_opencl',
	'code_pascal',
	'code_perl',
	'code_php',
	'code_powershell',
	'code_python',
	'code_python_1k',
	'code_python_2k',
	'code_python_5k',
	'code_r',
	'code_r_2k',
	'code_ruby',
	'code_rust',
	'code_scala',
	'code_sql',
	'code_swift',
	'code_systemverilog',
	'code_vim',
	'code_vimscript',
	'code_visual_basic',
	'code_zig',
	'croatian',
	'czech',
	'czech_10k',
	'czech_1k',
	'danish',
	'danish_10k',
	'danish_1k',
	'dutch',
	'dutch_10k',
	'dutch_1k',
	'english',
	'english_10k',
	'english_1k',
	'english_25k',
	'english_450k',
	'english_5k',
	'english_commonly_misspelled',
	'english_contractions',
	'english_doubleletter',
	'english_punctuation',
	'esperanto',
	'esperanto_10k',
	'esperanto_1k',
	'esperanto_25k',
	'esperanto_36k',
	'esperanto_h_sistemo',
	'esperanto_h_sistemo_10k',
	'esperanto_h_sistemo_1k',
	'esperanto_h_sistemo_25k',
	'esperanto_h_sistemo_36k',
	'esperanto_x_sistemo',
	'esperanto_x_sistemo_10k',
	'esperanto_x_sistemo_1k',
	'esperanto_x_sistemo_25k',
	'esperanto_x_sistemo_36k',
	'estonian',
	'estonian_10k',
	'estonian_1k',
	'filipino',
	'filipino_1k',
	'finnish',
	'finnish_10k',
	'finnish_1k',
	'french',
	'french_10k',
	'french_1k',
	'french_2k',
	'french_600k',
	'friulian',
	'georgian',
	'german',
	'german_10k',
	'german_1k',
	'german_250k',
	'git',
	'greek',
	'greek_10k',
	'greek_1k',
	'greek_25k',
	'greek_5k',
	'hausa',
	'hausa_1k',
	'hebrew',
	'hebrew_10k',
	'hebrew_1k',
	'hebrew_5k',
	'hindi',
	'hindi_1k',
	'hinglish',
	'hungarian',
	'hungarian_2k',
	'icelandic_1k',
	'indonesian',
	'indonesian_10k',
	'indonesian_1k',
	'irish',
	'italian',
	'italian_1k',
	'italian_280k',
	'italian_60k',
	'italian_7k',
	'japanese_hiragana',
	'japanese_katakana',
	'jyutping',
	'kazakh',
	'kazakh_1k',
	'korean',
	'korean_1k',
	'korean_5k',
	'kurdish_central',
	'kurdish_central_2k',
	'kurdish_central_45k',
	'kyrgyz',
	'latin',
	'latvian',
	'latvian_1k',
	'lithuanian',
	'lithuanian_1k',
	'lithuanian_3k',
	'lojban_cmavo',
	'lojban_gismu',
	'lorem_ipsum',
	'macedonian',
	'macedonian_10k',
	'macedonian_1k',
	'macedonian_75k',
	'malagasy',
	'malagasy_1k',
	'malay',
	'malayalam',
	'maltese',
	'maltese_1k',
	'maori_1k',
	'marathi',
	'mongolian',
	'mongolian_10k',
	'myanmar_burmese',
	'nepali',
	'nepali_1k',
	'norwegian',
	'norwegian_10k',
	'norwegian_1k',
	'norwegian_5k',
	'norwegian_nynorsk',
	'oromo',
	'oromo_1k',
	'oromo_5k',
	'persian',
	'persian_1k',
	'persian_20k',
	'persian_5k',
	'persian_romanized',
	'pig_latin',
	'pinyin',
	'pinyin_10k',
	'pinyin_1k',
	'polish',
	'polish_10k',
	'polish_200k',
	'polish_20k',
	'polish_2k',
	'polish_40k',
	'polish_5k',
	'portuguese',
	'portuguese_3k',
	'portuguese_acentos_e_cedilha',
	'romanian',
	'russian',
	'russian_10k',
	'russian_1k',
	'russian_25k',
	'russian_375k',
	'russian_50k',
	'sanskrit',
	'santali',
	'serbian',
	'shona',
	'shona_1k',
	'sinhala',
	'slovak',
	'slovak_10k',
	'slovak_1k',
	'slovenian',
	'spanish',
	'spanish_10k',
	'spanish_1k',
	'swahili_1k',
	'swedish',
	'swedish_1k',
	'swedish_diacritics',
	'swiss_german',
	'swiss_german_1k',
	'swiss_german_2k',
	'tamil',
	'tamil_1k',
	'telugu',
	'telugu_1k',
	'thai',
	'toki_pona',
	'toki_pona_ku_lili',
	'toki_pona_ku_suli',
	'turkish',
	'turkish_1k',
	'turkish_5k',
	'twitch_emotes',
	'udmurt',
	'ukrainian',
	'ukrainian_10k',
	'ukrainian_1k',
	'ukrainian_50k',
	'ukrainian_endings',
	'ukrainian_latynka',
	'ukrainian_latynka_10k',
	'ukrainian_latynka_1k',
	'ukrainian_latynka_50k',
	'ukrainian_latynka_endings',
	'urdu',
	'urdu_1k',
	'urdu_5k',
	'uzbek',
	'uzbek_1k',
	'vietnamese',
	'vietnamese_1k',
	'vietnamese_5k',
	'welsh',
	'welsh_1k',
	'wordle',
	'wordle_1k',
	'yiddish',
	'yoruba_1k'
];

export const useHomeStore = defineStore('counter', () => {
	const settings = ref([
		{
			tab: 'Game',
			settings: [
				{
					title: 'Difficulty',
					description:
						'Sets the difficulty of the selected words',
					selected: 'easy',
					option: [
						'easy',
						'medium',
						'hard',
						'extra hard',
					],
					type: 'tab',
				},

				{
					title: 'Mode',
					description:
						'The mode of the tests. Word means you will be tested within a duration, word means you will be tested a certain number of words.',
					selected: 'word',
					option: ['word', 'time', 'infinity'],
					type: 'tab',
				},
				{
					title: 'Total words',
					description:
						'Number of words that you will be tested.',
					selected: 10,
					option: [10, 25, 50, 100],
					type: 'tab',
				},
				{
					title: 'Duration',
					description:
						'The duration of the tests.',
					selected: 15,
					option: [15, 30, 60],
					type: 'tab',
				},
				{
					title: 'Dataset',
					description:
						'The source of the words that are selected.',
					selected: 'english',
					option: listLanguageOptions,
					type: 'select',
				},
				{
					title: 'Key',
					description:
						'Select a key to prioritize. If a value is selected, each selected words will contain the selected key.',
					selected: '',
					option: [
						'',
						'a',
						'b',
						'c',
						'd',
						'e',
						'f',
						'g',
						'h',
						'i',
						'j',
						'k',
						'l',
						'm',
						'n',
						'o',
						'p',
						'q',
						'r',
						's',
						't',
						'u',
						'v',
						'w',
						'x',
						'y',
						'z',
					],
					type: 'select',
				},
				{
					title: 'Max errors',
					description:
						'Restrict number of errors and reset the session when reached the maximum number of errors.',
					selected: 'off',
					option: ['on', 'off'],
					type: 'tab',
				},
				{
					title: 'Sifu mode',
					description:
						'Restart if there is a single error',
					selected: 'off',
					option: ['on', 'off'],
					type: 'tab',
				},
				{
					title: 'Min WPM',
					description:
						'Automatically fails a test if your WPM falls below a threshold.',
					selected: 'off',
					option: ['on', 'off'],
					type: 'tab',
				},
				{
					title: 'Min accuracy',
					description:
						'Automatically fails a test if your accuracy falls below a threshold.',
					selected: 'off',
					option: ['on', 'off'],
					type: 'tab',
				},
				{
					title: 'Min burst',
					description:
						'Automatically fails a test if your raw for a single word falls below this threshold.',
					selected: 'off',
					option: ['off', 'fixed', 'flex'],
					type: 'tab',
				},
				{
					title: 'Auto restart',
					description:
						'Automatically opens a new session upon finished.',
					selected: 'on',
					option: ['on', 'off'],
					type: 'tab',
				},
				{
					title: 'Quick restart',
					description:
						'Enables quickly restarting a new session with entering a key.',
					selected: 'Tab',
					option: ['Tab', 'Esc', 'off'],
					type: 'tab',
				},
			],
		},
		{
			tab: 'Input',
			settings: [
				{
					title: 'Space to skip word',
					description:
						'This enables using space to skip the words.',
					selected: 'off',
					option: ['on', 'off'],
					type: 'tab',
				},
				{
					title: 'Cursor stop at error',
					description:
						'Cursor will stop at error until you enter the correct character.',
					selected: 'off',
					option: ['on', 'off'],
					type: 'tab',
				},
				{
					title: 'Allow skip characters',
					description:
						'Incorrect input will skip the character and move to the next.',
					selected: 'off',
					option: ['on', 'off'],
					type: 'tab',
				},
				{
					title: 'Forgive extra characters',
					description:
						'This enables using space to skip the words.',
					selected: 'off',
					option: ['on', 'off'],
					type: 'tab',
				},
				{
					title: 'Freedom mode',
					value: 'freedomMode',
					description:
						'Allow you to delete any characters including correct ones',
					selected: 'off',
					option: ['on', 'off'],
					type: 'tab',
				},
				{
					title: 'Opposite shift mode',
					description:
						'Allow you to delete any characters including correct ones',
					selected: 'off',
					option: ['on', 'off'],
					type: 'tab',
				},
				{
					title: 'Confidence mode',
					description:
						'Allow you to delete any characters including correct ones',
					selected: 'off',
					option: ['on', 'off'],
					type: 'tab',
				},
			],
		},
		{
			tab: 'Appearance',
			settings: [
				{
					title: 'Smooth caret',
					description:
						'The caret will move smoothly between letters and words.',
					selected: 'on',
					option: ['on', 'off'],
					type: 'tab',
				},
				{
					title: 'Caret style',
					description:
						'Change the style of the caret during the test.',
					selected: '|',
					option: ['off', '|', '▮', '▯', '_'],
					type: 'tab',
				},
				{
					title: 'Set spacer style',
					description:
						'Change the appearance of spacer during the test.',
					selected: 'off',
					option: ['on', 'off'],
					type: 'tab',
				},
				{
					title: 'Font size',
					description:
						'Change the font size of the test words.',
					selected: 16,
					option: [
						12, 13, 14, 15, 16, 17, 18, 19,
						20, 21, 22, 23, 24,
					],
					type: 'select',
				},
				{
					title: 'Font family',
					description: 'Change font family.',
					selected: 'off',
					option: ['on', 'off'],
					type: 'tab',
				},
				{
					title: 'Page width',
					description:
						'This enables using space to skip the words.',
					selected: 'md',
					option: ['sm', 'md', 'lg'],
					type: 'tab',
				},
				{
					title: 'Timer',
					description:
						'Displays a live timer for timed tests and progress for words/custom tests.',
					selected: 'on',
					option: ['on', 'off'],
					type: 'tab',
				},
				{
					title: 'Live WPM',
					description:
						'Displays a live WPM speed during the test. Updates once every second.',
					selected: 'on',
					option: ['on', 'off'],
					type: 'tab',
				},
				{
					title: 'Live accuracy',
					description:
						'Displays live accuracy during the test.',
					selected: 'on',
					option: ['on', 'off'],
					type: 'tab',
				},
				{
					title: 'Caps lock warning',
					description:
						'Displays a warning when caps lock is on.',
					selected: 'off',
					option: ['on', 'off'],
					type: 'tab',
				},
			],
		},
	]);

	const difficulty: WritableComputedRef<DifficultyOptions> = computed({
		get: (): DifficultyOptions => {
			return settings.value[0].settings.find(
				(i) => i.title === 'Difficulty'
			)!.selected as DifficultyOptions;
		},
		set: (newValue): void => {
			settings.value[0].settings.find(
				(i) => i.title === 'Difficulty'
			)!.selected = newValue;
		},
	});
	const duration: WritableComputedRef<ConfigDurationOptions> = computed({
		get: (): ConfigDurationOptions => {
			return settings.value[0].settings.find(
				(i) => i.title === 'Duration'
			)!.selected as ConfigDurationOptions;
		},
		set: (newValue): void => {
			settings.value[0].settings.find(
				(i) => i.title === 'Duration'
			)!.selected = parseInt(newValue);
		},
	});
	const words: WritableComputedRef<ConfigTotalWordsOptions> = computed({
		get: (): ConfigTotalWordsOptions => {
			return settings.value[0].settings.find(
				(i) => i.title === 'Total words'
			)!.selected as ConfigTotalWordsOptions;
		},
		set: (newValue): void => {
			settings.value[0].settings.find(
				(i) => i.title === 'Total words'
			)!.selected = parseInt(newValue);
		},
	});
	const mode: WritableComputedRef<ModesOptions> = computed({
		get: (): ModesOptions => {
			return settings.value[0].settings.find(
				(i) => i.title === 'Mode'
			)!.selected as ModesOptions;
		},
		set: (newValue): void => {
			settings.value[0].settings.find(
				(i) => i.title === 'Mode'
			).selected = newValue;
		},
	});
	const key: WritableComputedRef<string> = computed({
		get: (): string => {
			return settings.value[0].settings.find(
				(i) => i.title === 'Key'
			)!.selected as string;
		},
		set: (newValue): void => {
			settings.value[0].settings.find(
				(i) => i.title === 'Key'
			).selected = newValue;
		},
	});
	const dataset: WritableComputedRef<ConfigSelectionOptions> = computed({
		get: (): ConfigSelectionOptions => {
			return settings.value[0].settings.find(
				(i) => i.title === 'Dataset'
			)!.selected as ConfigSelectionOptions;
		},
		set: (newValue): void => {
			settings.value[0].settings.find(
				(i) => i.title === 'Dataset'
			).selected = newValue;
		},
	});

	const freedomMode: WritableComputedRef<'on' | 'off'> = computed({
		get: (): 'on' | 'off' => {
			return settings.value[1].settings.find(
				(i) => i.value === 'freedomMode'
			)!.selected;
		},
		set: (newValue): void => {
			settings.value[1].settings.find(
				(i) => i.title === 'freedomMode'
			).selected = newValue;
		},
	});

	const durationOptions = computed(()=>{
		return settings.value[0].settings.find(
			(i) => i.title === 'Duration'
		).option;
	});

	const totalWordsOptions = computed(()=>{
		return settings.value[0].settings.find(
			(i) => i.title === 'Total words'
		).option;
	});
	
	const difficultyOptions = computed(()=>{
		return settings.value[0].settings.find(
			(i) => i.title === 'Difficulty'
		).option;
	});
	
	const keyOptions = computed(()=>{
		return settings.value[0].settings.find(
			(i) => i.title === 'Key'
		).option;
	});
	
	const datasetOptions = computed(()=>{
		return settings.value[0].settings.find(
			(i) => i.title === 'Dataset'
		).option;
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
		durationOptions,
		totalWordsOptions,
		keyOptions,
		difficultyOptions,
		datasetOptions,
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
		freedomMode,
	};
});
