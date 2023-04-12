<template>
	<div
		class="w-full h-14 flex justify-center border-b border-neutral-600 flex-none"
	>
		<div class="w-full items-center px-10 max-w-7xl flex gap-6 justify-between">
			<div class="h-full"><NuxtLink to="/"><button class="h-full items-center px-3 font-semibold text-xl"><span class="mr-3">🐙</span><span>keyboardkurita</span></button></NuxtLink></div>
                        <div class="h-full py-2.5 gap-4 flex">
                                <NuxtLink to="/explore"><button class="h-full items-center px-3">Explore</button></NuxtLink>
			<NuxtLink to="/settings"><button class="h-full items-center px-3 rounded">Settings</button></NuxtLink>
			<NuxtLink to="/profile"><button class="h-full items-center px-3">Profile</button></NuxtLink>
                </div>
		</div>
	</div>
</template>
