import type {Database} from './database.types';

type DifficultyOptions = 'easy' | 'medium' | 'hard' | 'extra_hard';
type ModesOptions = 'word' | 'time' | 'infinity';
type ConfigDurationOptions = 10 | 20 | 30 | 60 | null;
type ConfigTotalWordsOptions = 10 | 25 | 50 | null;
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
	currentChar: string;
};

//api / server
type CharacterMetadata = {
	character: string;
	end_time?: string;
	start_time?: string;
	status: CharLogStatus;
	index: number;
	word_index: number;
	duration?: number;
	wpm?: number;
	input?: string;
};
type WordMetadata = {
	word: string;
	characters?: CharacterMetadata[];
	type: WordType;
	index: number;
	end_time?: string;
	start_time?: string;
	status?: WordLogStatus;
	duration?: number;
	wpm?: number;
};

//db types
type SessionsInsert = Database['public']['Tables']['sessions']['Insert'];
type IntervalLogsInsert =
	Database['public']['Tables']['interval_logs']['Insert'];
type CharacterLogsInsertInferred =
	Database['public']['Tables']['character_logs']['Insert'];
type CharacterLogsInsert = {
	[K in keyof CharacterLogsInsertInferred]: K extends 'status'
	? CharLogStatus : CharacterLogsInsertInferred[K];
	};
type WordLogsInsertInferred =
	Database['public']['Tables']['word_logs']['Insert'];
type WordLogsInsert = {
	[K in keyof WordLogsInsertInferred]: K extends 'status'
	? WordLogStatus : WordLogsInsertInferred[K];
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
	SessionsInsert,
	IntervalLogsInsert,
	CharacterLogsInsert,
	WordLogsInsert
};
