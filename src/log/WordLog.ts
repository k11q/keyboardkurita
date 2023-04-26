import { WordLogsInsert } from '~/types';

export class WordLog {
	private data: Partial<WordLogsInsert>;

	constructor(params: Partial<WordLogsInsert>) {
		this.data = params;
	}

	setSessionId(value: number): this {
		this.data.session_id = value;
		return this;
	}
            
	getData(): WordLogsInsert {
		return this.data as WordLogsInsert;
	}
}