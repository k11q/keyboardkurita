<template>
	<div class="w-full">
		<v-chart
			class="chart"
			:option="option"
			@mousemove="onMouseMove"
			autoresize
		/>
	</div>
</template>

<script setup>
import * as echarts from "echarts";
import { use } from "echarts/core";
import { SVGRenderer } from "echarts/renderers";
import { LineChart } from "echarts/charts";
import { GridComponent, TooltipComponent } from "echarts/components";
import VChart, { THEME_KEY } from "vue-echarts";

use([LineChart, GridComponent, TooltipComponent, SVGRenderer]);

const props = defineProps({
	data: Object,
});

const formatTooltip = (params) => {
	const dataIndex = params[0].dataIndex;
	const wpm = props.data.wpm[dataIndex];
	const raw = props.data.raw[dataIndex];
	const error = props.data.error[dataIndex];
	return `
    <div class="bg-neutral-800 w-32 rounded-lg border backdrop-blur text-neutral-200 border-neutral-700/70 px-2 py-1 text-sm flex flex-col">
	<div class="flex gap-2 items-center"><div class="h-2.5 w-2.5 bg-[#6BD968] rounded-full"></div><div class="flex items-center justify-between flex-grow"><div class="tabular-nums font-mono tracking-wide">${wpm}</div><div class="text-neutral-400 tracking-wide">wpm</div></div></div>
	<div class="flex gap-2 items-center"><div class="h-2.5 w-2.5 bg-[#525252] rounded-full"></div><div class="flex items-center justify-between flex-grow"><div class="tabular-nums font-mono tracking-wide">${raw}</div><div class="text-neutral-400 tracking-wide">raw</div></div></div>
	<div class="flex gap-2 items-center"><div class="h-2.5 w-2.5 bg-[#F44250] rounded-full"></div><div class="flex items-center justify-between flex-grow"><div class="tabular-nums font-mono tracking-wide">${error}</div><div class="text-neutral-400 tracking-wide">error</div></div></div>
    </div>
  `;
};

const option = computed(() => ({
	tooltip: {
		trigger: "axis",
		axisPointer: {
			animation: false,
		},
		formatter: formatTooltip,
		backgroundColor: "transparent", // Set the background color to transparent
		extraCssText: `
    box-shadow: none;
    border: none;
    padding: 0;
  `,
		borderWidth: 0,
		padding: 0,
	},
	grid: {
		top: "10%",
		bottom: "13%",
		left: "5%",
		right: "4%",
		containLabels: true,
	},
	xAxis: {
		type: "value",
		axisLabel: {
			color: "#888",
		},
		axisLine: {
			lineStyle: {
				color: "#333",
			},
		},
		splitLine: {
			show: true,
			lineStyle: {
				color: "#262626",
			},
		},
		boundryGaps: false,
		min: 1,
		max: props.data.time.length,
	},
	yAxis: [
		{
			type: "value",
			position: "left",
			axisLabel: {
				color: "#888",
			},
			axisLine: {
				lineStyle: {
					color: "#333",
				},
			},
			splitLine: {
				lineStyle: {
					color: "#262626",
				},
			},
			splitNumber: 3,
		},
		{
			type: "value",
			position: "right",
			axisLabel: {
				color: "#888",
				formatter: function (value) {
					if (Number.isInteger(value)) {
						return value;
					}
				},
			},
			axisLine: {
				lineStyle: {
					color: "#333",
				},
			},
			splitLine: {
				show: false,
			},
			splitNumber: 3,
			max: Math.max(...props.data.error),
		},
	],
	series: [
		{
			name: "Raw",
			type: "line",
			data: props.data.raw.map((value, index) => [
				index + 1,
				value,
			]),
			color: "#888",
			smooth: true,
			areaStyle: {
				color: "#202020",
			},
			lineStyle: {
				width: 2,
			},
			symbol: "circle",
			symbolSize: 6,
			itemStyle: {
				color: "#525252",
			},
		},
		{
			name: "WPM",
			type: "line",
			data: props.data.wpm.map((value, index) => [
				index + 1,
				value,
			]),
			color: "#6BD968",
			smooth: true,
			lineStyle: {
				width: 2,
			},
			symbol: "circle",
			symbolSize: 6,
			itemStyle: {
				color: "#6BD968",
			},
		},
		{
			name: "Errors",
			type: "scatter",
			yAxisIndex: 1,
			data: props.data.error
				.map((value, index) =>
					value > 0 ? [index + 1, value] : null
				)
				.filter(Boolean),
			itemStyle: {
				color: "#F44250",
			},
			symbol: "image://./x.png",
			symbolSize: 13,
		},
	],
}));
</script>

<style>
.chart {
	height: 175px;
	width: 100%;
}
x-vue-echarts {
	width: 100%;
}
</style>
