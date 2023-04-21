<template>
	<div class="w-full max-w-xl font-mono text-lg leading-none">
		<div
			class=" grid gap-2 grid-cols-12"
		>
			<div
				class="col-span-4 border border-neutral-700 rounded-lg p-1 h-11 flex items-center justify-center text-xl"
			>
				<button
					:class="`flex-grow items-center justify-center flex h-full rounded-md ${
						mode === 'word'
							? 'bg-neutral-700/60 border border-neutral-600/50'
							: 'text-neutral-500'
					}`"
					@click="mode = 'word'"
				>
					<div>WORD</div>
				</button>
				<button
					:class="`flex-grow items-center justify-center flex h-full rounded-md ${
						mode === 'time'
							? 'bg-neutral-700/60 border border-neutral-600/50'
							: 'text-neutral-500'
					}`"
					@click="mode = 'time'"
				>
					<div>TIME</div>
				</button>
			</div>
			<div
				class="relative col-span-4 bg-neutral-800/50 border border-neutral-700 rounded-lg px-3 h-11 flex items-center justify-center"
			>
				<select
					v-if="mode === 'time'"
					v-model="selectedDuration"
					style="
					all: unset;
					position: absolute;
					width: 100%;
					text-align: center;
					padding-left: 16px;
				"
				>
					<option
						v-for="option in durationOptions"
						:value="option"
					>
						{{ option }}s
					</option>
				</select>
				<span
					v-if="mode === 'time'"
					class="-translate-x-6 -mt-[1px] text-neutral-300"
				><Icon
					name="lucide:clock"
					size="1.125rem"
				/></span>
				<select
					v-if="mode === 'word'"
					v-model="words"
					style="
					all: unset;
					position: absolute;
					width: 100%;
					text-align: center;
					padding-left: 16px;
				"
				>
					<option
						v-for="option in totalWordsOptions"
						:value="option"
					>
						{{ option }}
					</option>
				</select>
				<span
					v-if="mode === 'word'"
					class="-translate-x-6 mt-0.5 text-neutral-300"
				><Icon
					name="lucide:case-upper"
					size="1.75rem"
				/></span>
				<SettingsBarSelectChevron />
			</div>
			<div
				class="relative col-span-4 bg-neutral-800/50 border border-neutral-700 rounded-lg px-3 h-11 flex items-center justify-center"
			>
				<select
					v-model="selectedDifficulty"
					style="
					all: unset;
					position: absolute;
					width: 100%;
					text-align: center;
				"
				>
					<option
						v-for="option in difficultyOptions"
						:value="option"
					>
						{{ option }}
					</option>
				</select>
				<SettingsBarSelectChevron />
			</div>
			<div
				class="relative col-span-8 bg-neutral-800/50 border border-neutral-700 rounded-lg px-3 h-11 flex items-center justify-center"
			>
				<select
					v-model="selectedDataset"
					style="
					all: unset;
					position: absolute;
					width: 100%;
					text-align: center;
				"
				>
					<option
						v-for="option in datasetOptions"
						:value="option"
					>
						{{ option }}
					</option>
				</select>
				<SettingsBarSelectChevron />
			</div>
			<div
				class="relative col-span-4 bg-neutral-800/50 border border-neutral-700 rounded-lg px-3 h-11 flex items-center justify-center"
			>
				<select
					v-model="selectedKey"
					style="
					all: unset;
					position: absolute;
					width: 100%;
					text-align: center;
				"
				>
					<option
						v-for="option in keyOptions"
						:value="option"
					>
						{{
							option === ""
								? "any key"
								: option.toUpperCase()
						}}
					</option>
				</select>
				<SettingsBarSelectChevron />
			</div>
			<div
				class="col-span-3 bg-neutral-800/50 border border-neutral-700 rounded-lg px-3 h-11 flex items-center justify-center"
			>
				<div>timer</div>
			</div>
			<div
				class="col-span-3 bg-neutral-800/50 border border-neutral-700 rounded-lg px-3 h-11 flex items-center justify-center"
			>
				<div>wpm</div>
			</div>
			<div
				class="col-span-3 bg-neutral-800/50 border border-neutral-700 rounded-lg px-3 h-11 flex items-center justify-center"
			>
				<div>raw</div>
			</div>
			<div
				class="col-span-3 bg-neutral-800/50 border border-neutral-700 rounded-lg px-3 h-11 flex items-center justify-center"
			>
				<div>accuracy</div>
			</div>
		</div>
		<div class="flex justify-end pt-3">
			<button
				class=" text-neutral-400 hover:text-white transition-all text-md"
				@click="isOpen=true"
			>
				More settings
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useHomeStore } from '@/stores/home';
import { storeToRefs } from 'pinia';
const store = useHomeStore();
const {
	settings,
	difficulty: selectedDifficulty,
	mode,
	key: selectedKey,
	duration: selectedDuration,
	dataset: selectedDataset,
	durationOptions,
	keyOptions,
	difficultyOptions,
	datasetOptions,
	words,
	totalWordsOptions,
} = storeToRefs(store);
const isOpen = useState('isOpen');
</script>
