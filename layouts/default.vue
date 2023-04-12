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
