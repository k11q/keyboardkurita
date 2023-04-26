import { SessionsInsert } from '~/types';

export class Session {
	private data: Partial<SessionsInsert>;

	constructor(params: Partial<SessionsInsert>) {
		this.data = params;
	}

	getData(): SessionsInsert {
		return this.data as SessionsInsert;
	}
}