<script setup>
useHead({
	script: [
		{
			"data-token": "a80211cd-14e0-406b-81fa-d0e2c17b27c8",
			src: "https://beamanalytics.b-cdn.net/beam.min.js",
			async: true,
		},
	],
});
</script>

<template>
	<div
		class="flex flex-col items-center bg-black text-white min-h-screen"
	>
		<TopBar />
		<slot />
	</div>
</template>

<style>
body {
	background-color: black;
}
select {
	-webkit-appearance: none;
	-moz-appearance: none;
	text-indent: 1px;
	text-overflow: "";
}
select::-ms-expand {
	display: none;
}

/* Set the background color and border radius of the scrollbar track */
::-webkit-scrollbar-track {
	background-color: rgba(0, 0, 0, 0.1);
	border-radius: 10px;
}

/* Set the background color, border radius, and minimal height of the scrollbar thumb */
::-webkit-scrollbar-thumb {
	background-color: rgba(57, 57, 57, 0.4);
	border-radius: 10px;
	min-height: 30px;
	min-width: 30px;
}

/* Change the background color of the scrollbar thumb when hovering */
::-webkit-scrollbar-thumb:hover {
	background-color: rgba(255, 255, 255, 0.08);
}

::-webkit-scrollbar-corner {
  background-color: transparent;
}
</style>
