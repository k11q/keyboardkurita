<template>
	<div
		v-if="props.pastSessions.length && props.currentSelectionData"
		id="resultsChart"
		class="w-full flex flex-col gap-4 items-center justify-center relative"
	>
		<div class="flex flex-col w-full font-mono">
			<div class="grid grid-cols-5 gap-x-2 gap-y-2">
				<div class="w-36 flex-none flex flex-col gap-2">
					<div class="flex flex-col">
						<div
							class="text-3xl text-neutral-500"
						>
							wpm
						</div>
						<div
							class="text-6xl leading-none font-mono text-[#6BD968]"
						>
							<CounterAnimation
								:value="
									props
										.currentSelectionData
										?.wpm
								"
								:duration="1000"
								:digits="2"
							/>
						</div>
					</div>
					<div class="flex flex-col">
						<div
							class="text-3xl text-neutral-500"
						>
							acc
						</div>
						<div
							class="text-6xl leading-none font-mono text-[#6BD968]"
						>
							<CounterAnimation
								:value="
									props
										.currentSelectionData
										?.accuracy
								"
								:duration="1000"
								:digits="2"
							/>%
						</div>
					</div>
				</div>
				<div class="col-span-4 -ml-5">
					<ClientOnly>
						<ResultsChart
							:data="
								props
									.currentSelectionData
									.chart_data
							"
						/>
					</ClientOnly>
				</div>
				<div class="flex flex-col gap-1">
					<div class="text-base text-neutral-500">
						type
					</div>
					<div
						class="text-base leading-tight font-mono text-[#6BD968]"
					>
						<div>
							{{
								props
									.currentSelectionData
									?.mode
							}}
							{{
								props
									.currentSelectionData
									.total_words
							}}
						</div>
						<div>
							{{
								props
									.currentSelectionData
									?.dataset
							}}
						</div>
					</div>
				</div>
				<div class="flex flex-col">
					<div class="text-base text-neutral-500">
						raw
					</div>
					<div
						class="text-3xl leading-tight font-mono text-[#6BD968]"
					>
						<div>
							{{
								props
									.currentSelectionData
									?.raw
							}}
						</div>
					</div>
				</div>
				<div class="flex flex-col">
					<div class="text-base text-neutral-500">
						characters
					</div>
					<div
						class="text-3xl leading-tight font-mono text-[#6BD968]"
					>
						{{
							props
								.currentSelectionData
								?.total_corrects
						}}/{{
							props
								.currentSelectionData
								?.total_errors
						}}/{{
							props
								.currentSelectionData
								?.total_extras
						}}/{{
							props
								.currentSelectionData
								?.total_missed
						}}
					</div>
				</div>
				<div class="flex flex-col">
					<div class="text-base text-neutral-500">
						consistency
					</div>
					<div
						class="text-3xl leading-tight font-mono text-[#6BD968]"
					>
						{{
							props
								.currentSelectionData
								?.consistency
						}}%
					</div>
				</div>
				<div class="flex flex-col">
					<div class="text-base text-neutral-500">
						time
					</div>
					<div
						class="text-3xl leading-tight font-mono text-[#6BD968]"
					>
						{{
							props
								.currentSelectionData
								?.duration
						}}s
					</div>
				</div>
			</div>
		</div>
		<div class="w-full">
			<div class="text-base text-neutral-500">
				input history
			</div>
			<div>
				<div
					class="w-full"
					@click.prevent.stop="
						props.currentActive &&
						props.currentActive.id ===
							'MasterInput'
							? ''
							: focusInput()
					"
				>
					<template
						v-for="(word, index) in props
							.currentSelectionData
							.logs"
						:key="index"
					>
						<span
							><span
								v-for="(
									char,
									charIndex
								) in word.characters"
								:key="charIndex"
								:class="` ${
									char.status ===
									'correct'
										? 'opacity-100'
										: char.status ===
										  'extra'
										? 'bg-[#F44250] text-white opacity-100'
										: char.status ===
												'error' &&
										  char.character ===
												' '
										? 'box-border border-b border-red-600'
										: char.status ===
										  'error'
										? 'text-[#F44250] opacity-100'
										: 'opacity-40'
								} ${
									index ===
										props.currentWordNum &&
									charIndex ===
										props.correctCharIndex
										? 'cursor-key'
										: ''
								}`"
								>{{
									char.character ===
									' '
										? ' '
										: char.character
								}}</span
							></span
						>
					</template>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import ResultsChart from './ResultsChart.vue';

const props = defineProps({
	pastSessions: Array,
	currentSelectionData: Object,
	currentWordNum: Number,
	correctCharIndex: Number,
	focusInput: Function,
});
</script>
