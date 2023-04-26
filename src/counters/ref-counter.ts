import { ref } from 'vue';

class RefCounter {
	protected count: globalThis.Ref<number>;
	
	constructor() {
		this.count = ref(0);
	}
      
	increment() {
		this.count.value++;
	}

	decrement() {
		this.count.value--;
	}
      
	reset() {
		this.count.value = 0;
	}

	setValue(num: number) {
		this.count.value = num;
	}
      
	getValue() {
		return this.count.value;
	}
}
      
export { RefCounter };