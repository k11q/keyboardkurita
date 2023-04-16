<template>
	<div class="w-full">
		<v-chart class="chart" :option="option" autoresize />
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

const option = computed(() => ({
	tooltip: {
		trigger: "axis",
		axisPointer: {
			animation: false,
		},
	},
	grid: {
		top: "10%",
		bottom: "10%",
		left: "5%",
		right: "5%",
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
