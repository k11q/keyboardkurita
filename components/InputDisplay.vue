<template>
  <div v-if="!props.showResults" class="flex-grow flex items-center justify-center">
    <div
      :class="`pointer-events-none flex items-center justify-center font-mono transition-all ease-linear duration-1000 rounded-[32px] w-full left-0 right-0 text-4xl leading-[54px]`"
    >
      <div
        class="w-full max-w-6xl px-6 mb-20 h-[14rem] flex-none"
        @click.prevent.stop="emit('buttonClick')"
      >
        <template v-for="(word, index) in props.allData" :key="index">
          <span>
            <span
              v-for="(char, charIndex) in word.characters"
              :key="charIndex"
              :class="getClass(char, index, charIndex)"
            >
              {{ char.character === " " ? " " : char.character }}
            </span>
          </span>
        </template>
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
});

const getClass = (char, index, charIndex) => {
  const baseClass =
    char.status === "correct"
      ? "opacity-100"
      : char.status === "extra"
      ? "bg-[#F44250] text-white opacity-100"
      : char.status === "error" && char.character === " "
      ? "box-border border-b-2 border-red-600"
      : char.status === "error"
      ? "text-[#F44250] opacity-100"
      : "opacity-40";

  const cursorClass =
    index === props.currentWordNum && charIndex === props.correctCharIndex
      ? "cursor-key"
      : "";

  return `${baseClass} ${cursorClass}`;
};

const emit = defineEmits(["buttonClick"]);
</script>
