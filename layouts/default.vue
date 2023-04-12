<script setup>
useHead({
  script: [{'data-token':"a80211cd-14e0-406b-81fa-d0e2c17b27c8", src:"https://beamanalytics.b-cdn.net/beam.min.js", async: true}],
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
</style>
