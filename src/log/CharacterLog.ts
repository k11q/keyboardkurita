import { CharacterLogsInsert } from '~/types';

export class CharacterLog {
	private data: Partial<CharacterLogsInsert>;

	constructor(params: Partial<CharacterLogsInsert>) {
		this.data = params;
	}

	setSessionId(value: number): this {
		this.data.session_id = value;
		return this;
	}
            
	getData(): CharacterLogsInsert {
		return this.data as CharacterLogsInsert;
	}
}