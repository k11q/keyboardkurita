<template>
  <div v-if="!props.showResults" class="flex-grow flex flex-col items-center justify-center">
    <div
      :class="`pointer-events-none flex items-center justify-center font-mono transition-all ease-linear duration-1000 rounded-[32px] w-full left-0 right-0 text-4xl leading-[54px]`"
    >
      <div
        class="w-full max-w-6xl px-6 mb-20 h-[162px] overflow-hidden flex-none"
        @click.prevent.stop="emit('buttonClick')"
      >
      <div>
        <template v-for="(word, index) in props.allData" :key="index">
          <span v-if="word.index >= props.startDisplayIndex && word.index <= props.startDisplayIndex+40" :class="`${word.status === 'error' ? 'underline decoration-red-500 underline-offset-8 decoration-2' : ''}`">
            <span
              v-for="(char, charIndex) in word.characters"
              :key="charIndex"
              class="relative"
            >
              <span :class="getClass(char, index, charIndex)">{{ char.character === " " ? " " : char.character }}</span>
              <span v-if="char.input" class="text-red-300 absolute top-full left-0 right-0 text-base leading-none text-center">{{ char.input ? char.input : '' }}</span>
            </span>
          </span>
        </template>
      </div>
      </div>
    </div>
    <div class="relative h-0 w-full flex justify-center">
			<div class="absolute left-0 right-0 text-center text-neutral-500">
				<Icon name="lucide:lightbulb" size="1.25rem" class="mr-2 -mt-0.5 text-yellow-500"/><span>Press <span class="border rounded-md border-neutral-700 font-mono px-2 py-1 bg-neutral-800 text-neutral-400 mx-1">tab</span> to quick restart</span>
			</div>
		</div>
  </div>
</template>

<script setup>
const props = defineProps({
  showResults: Boolean,
  allData: Array,
  currentActive: Object,
  currentWordNum: Number,
  correctCharIndex: Number,
  startDisplayIndex: Number,
  endDisplayIndex: Number,
});

const getClass = (char, index, charIndex) => {
  const baseClass =
    char.status === "correct"
      ? ""
      : char.status === "extra"
      ? "bg-[#F44250] text-white"
      : char.status === "error" && char.character === " "
      ? "box-border border-b-2 border-red-600"
      : char.status === "error"
      ? "text-[#F44250]"
      : "text-neutral-500";

  const cursorClass =
    index === props.currentWordNum && charIndex === props.correctCharIndex
      ? "cursor-key"
      : "";

  return `${baseClass} ${cursorClass}`;
};

const emit = defineEmits(["buttonClick"]);
</script>
