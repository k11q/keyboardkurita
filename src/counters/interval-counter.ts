import BaseCounter from './base-counter';

class IntervalCounter extends BaseCounter{
	constructor() {
		super();
		this.value = 1;
	}

	reset(): void {
		this.value = 1;
	}
}

export {IntervalCounter};