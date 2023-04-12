<template>
	<Line id="chart" :options="chartOptions" :data="chartData" />
</template>

<script setup>
import { Line } from "vue-chartjs";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
	Filler,
} from "chart.js";

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
	Filler
);

const props = defineProps({
	chartData: {
		type: Object,
		required: true,
	},
});

function externalTooltipHandler(){
        return '<div>Hello</div>'
}

const chartOptions = ref({
	//aspectRatio: 3 / 2,
	responsive: true,
	maintainAspectRatio: false,
	elements: {
		line: {
			tension: 0.2,
		},
	},
	scales: {
		x: {
			border: {
				dash: [10],
			},
			grid: {
				color: "#232323",
			},
                        /*
			ticks: {
				display: false,
			},
			points: {
				display: false
			}*/
		},/*
		y: {
			border: {
				display: false,
			},
			grid: {
				display: false,
			},
			ticks: {
				display: false,
			},
		},*/
	},
	plugins: {
		legend: {
			display: false,
			labels: {
				// This more specific font property overrides the global property
				font: {
					family: "Inter",
					size: 14,
				},
			},
		},
		tooltip: {
			//enabled: false,
			external: externalTooltipHandler
		}
	},
	interaction: { intersect: false },
});
</script>