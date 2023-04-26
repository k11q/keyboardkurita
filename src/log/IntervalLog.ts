import { IntervalLogsInsert } from '~/types';

export class IntervalLog {
	private data: Partial<IntervalLogsInsert>;

	constructor(params: Partial<IntervalLogsInsert>) {
		this.data = params;
	}

	setSessionId(value: number): this {
		this.data.session_id = value;
		return this;
	}
            
	getData(): IntervalLogsInsert {
		return this.data as IntervalLogsInsert;
	}
}