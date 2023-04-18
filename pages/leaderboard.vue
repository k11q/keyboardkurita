<template>
	<div class="max-w-6xl w-full py-10 flex flex-col gap-10 px-10 flex-none">
		<div
			v-for="i in 3"
			class="flex flex-col"
		>
			<h2 class="font-mono text-4xl mb-6">
				10s
			</h2>
			<table class="w-full font-mono text-neutral-200 flex flex-col gap-0.5 m-0">
				<thead class="flex flex-col gap-0.5 text-neutral-500 uppercase">
					<tr
						class="h-7 grid grid-cols-13 bg-neutral-800/30 [&>*]:border-r-2 [&>*]:border-neutral-900"
					>
						<td class="flex items-center pr-0 py-0 pl-2">
							<div>no</div>
						</td>
						<td class="col-span-5 flex items-center gap-4 p-0">
							<div
								class="w-[33px] h-7 border-r-2 border-neutral-900"
							/>
							<div>user</div>
						</td>
						<td class="flex items-center pr-0 py-0 pl-2">
							<div>wpm</div>
						</td>
						<td class="flex items-center pr-0 py-0 pl-2">
							<div>raw</div>
						</td>
						<td class="flex items-center pr-0 py-0 pl-2">
							<div>acc</div>
						</td>
						<td class="flex items-center pr-0 py-0 pl-2">
							<div>consis</div>
						</td>
						<td class="col-span-3 flex items-center py-0 pr-4 justify-end">
							<span>date</span>
						</td>
					</tr>
				</thead>
				<tbody class="flex flex-col gap-0.5">
					<tr
						v-for="i in 10"
						class="h-[33px] grid grid-cols-13 bg-neutral-800/60 even:bg-neutral-800/20 [&>*]:border-r-2 [&>*]:border-neutral-900"
					>
						<td class="flex items-center pr-0 py-0 pl-2">
							<div>{{ i }}</div>
						</td>
						<td class="col-span-5 flex items-center gap-4 p-0">
							<div
								class="h-[33px] w-[33px] bg-neutral-600 border-r-2 border-neutral-900"
							/>
							<div>khairulhaaziq</div>
						</td>
						<td class="flex items-center pr-0 py-0 pl-2">
							<div>99.4%</div>
						</td>
						<td class="flex items-center pr-0 py-0 pl-2">
							<div>99.4%</div>
						</td>
						<td class="flex items-center pr-0 py-0 pl-2">
							<div>99.4%</div>
						</td>
						<td class="flex items-center pr-0 py-0 pl-2">
							<div>99.4%</div>
						</td>
						<td class="col-span-3 flex items-center py-0 pr-4 justify-end text-neutral-400">
							<span>19/2/2027 11:52 PM</span>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>
