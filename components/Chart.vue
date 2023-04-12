<template>
	<v-chart class="chart" :option="option" />
</template>

<script setup>
import * as echarts from "echarts";
import { use } from "echarts/core";
import { SVGRenderer } from "echarts/renderers";
import { BarChart } from "echarts/charts";
import { GridComponent, TooltipComponent } from "echarts/components";
import VChart, { THEME_KEY } from "vue-echarts";
import { ref, provide } from "vue";

use([BarChart, GridComponent, TooltipComponent, SVGRenderer]);

const props = defineProps({
	data: Array,
	columns: Array,
});

const option = computed(() => ({
	tooltip: {
		trigger: "axis",
		axisPointer: {
			animation: false,
		},
	},
	xAxis: {
		type: "category",
		data: props.columns,
		splitLine: {
            lineStyle: {
                color: '#555555'
            }
        }
	},
	yAxis: {
		type: "value",
		splitLine: {
            lineStyle: {
                color: '#555555'
            }
        }
	},
	series: [
		{
			type: "bar",
			data: props.data,
                        animation: false,
                        color: '#D83BD2',
		},
	],
}));
</script>

<style scoped>
.chart {
        margin-top: -30px;
        margin-bottom: -20px;
        padding-top: 0px;
	height: 320px;
}
</style>
