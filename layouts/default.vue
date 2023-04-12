<template>
	<div class="flex flex-col items-center bg-black text-white min-h-screen">
                <TopBar />
		<slot />
	</div>
</template>

<style>
body {
	background-color: black;
}
</style>
