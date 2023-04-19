type DifficultyOptions = 'easy' | 'medium' | 'hard' | 'extra_hard';
type ModesOptions = 'word' | 'time' | 'infinity';
type ConfigDurationOptions = 10 | 20 | 30 | 60 | undefined;
type ConfigTotalWordsOptions = 10 | 25 | 50 | undefined;
type ConfigSelectionOptions = 'english_50k' | 'supabase-docs' | 'supabase code';
type CharLogStatus = 'error' | 'correct' | 'pending' | 'extra';
type WordLogStatus = 'error' | 'correct' | 'incomplete' | 'skipped'
type KeystrokeLog = {
	character: string;
	time: number;
	status: CharLogStatus;
};
type WordType = 'separator' | 'word';

//index.vue specific
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

//api / server
type CharacterMetadata = {
	character: string;
	end_time?: string;
	start_time?: string;
	status: CharLogStatus;
	char_index: number;
	word_index: number;
	duration?: number;
};
type WordMetadata = {
	word: string;
	characters: CharacterMetadata[];
	type: WordType;
	index: number;
};

export {
	DifficultyOptions,
	ModesOptions,
	ConfigDurationOptions,
	ConfigTotalWordsOptions,
	ConfigSelectionOptions,
	CharLogStatus,
	WordLogStatus,
	CharacterMetadata,
	WordMetadata,
	WordType,
	ChartData,
	CharacterPerformance,
	InputMetadata,
	KeystrokeLog,
};
