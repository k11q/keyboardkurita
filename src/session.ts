import { SessionsInsert } from '~/types';
import { Json } from '~/types/database.types';

class Session implements SessionsInsert {
	user_id: number;
	start_time: string;
	difficulty: string;
	mode: string;
	game_metadata: Json;
	end_time: string;
	duration: number;
	wpm: number;
	accuracy: number;
	consistency: number;
	raw: number;
	total_corrects: number;
	total_errors: number;
	total_extras: number;
	total_missed: number;
	total_characters: number;
	total_words: number;
	words: string[];
	logs: never[];
	xp_gains: number;
	dataset: string;
	numbers: boolean;
	punctuation: boolean;
	restart_count: number;

	constructor() {
		this.user_id = 0;
		this.start_time = '';
		this.difficulty = '';
		this.mode = '';
		this.game_metadata = {};
		this.end_time = '';
		this.duration = 0;
		this.wpm = 0;
		this.accuracy = 0;
		this.consistency = 0;
		this.raw = 0;
		this.total_corrects = 0;
		this.total_errors = 0;
		this.total_extras = 0;
		this.total_missed = 0;
		this.total_characters = 0;
		this.total_words = 0;
		this.words = [];
		this.logs = [];
		this.xp_gains = 0;
		this.dataset = '';
		this.numbers = false;
		this.punctuation = false;
		this.restart_count = 0;
	}
}
      
export default Session;