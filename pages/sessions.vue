<template>
		<div
			:class="`flex flex-col items-center gap-6 flex-grow left-0 right-0 px-10`"
		>
			<template v-if="pastSessions && pastSessions.length">
				<div
					class="flex flex-col justify-center px-6"
					v-show="
						!currentActive ||
						(currentActive &&
							currentActive.id !==
								'MasterInput')
					"
				>
					<div
						class="rounded-lg border border-neutral-700 w-full overflow-clip"
					>
						<div
							class="justify-between px-6 py-4 grid grid-cols-10 text-sm text-neutral-400 bg-neutral-900"
						>
							<div class="col-span-2">
								<div>
									username
								</div>
							</div>
							<div>
								<div>wpm</div>
							</div>
							<div>
								<div>raw</div>
							</div>
							<div>
								<div>acc</div>
							</div>
							<div>
								<div>
									consistency
								</div>
							</div>
							<div>
								<div>chars</div>
							</div>
							<div>
								<div>mode</div>
							</div>
							<div class="col-span-2">
								<div>date</div>
							</div>
						</div>
						<div
							v-for="session in pastSessions
									.slice()
									.reverse()"
							class="justify-between px-6 py-4 border-t bg-neutral-800/40 border-neutral-800 grid grid-cols-10"
						>
							<div class="col-span-2">
								<div>
									{{
										session.username
									}}
								</div>
							</div>
							<div>
								<div
									class="text-[#6BD968]"
								>
									{{
										session.wpm.toFixed(
											1
										)
									}}
								</div>
							</div>
							<div>
								<div
									class="tabular-nums"
								>
									{{
										session.raw.toFixed(
											1
										)
									}}
								</div>
							</div>
							<div>
								<div
									class="tabular-nums"
								>
									{{
										session.accuracy.toFixed(
											1
										)
									}}
								</div>
							</div>
							<div>
								<div
									class="tabular-nums"
								>
									{{
										session.consistency.toFixed(
											1
										)
									}}
								</div>
							</div>
							<div>
								<div
									class="tabular-nums"
								>
									{{
										session.total_corrects
									}}/{{
										session.total_errors
									}}/{{
										session.total_extras
									}}/{{
										session.total_missed
									}}
								</div>
							</div>
							<div>
								<div>
									{{
										session.mode
									}}
								</div>
							</div>
							<div class="col-span-2">
								<div
									class="tabular-nums line-clamp-1"
								>
									{{
										format(
											new Date(
												session.end_time
											),
											"Pp"
										)
									}}
								</div>
							</div>
						</div>
					</div>
				</div>
			</template>
		</div>
</template>

<script setup lang="ts">
import { format } from "date-fns";
//db & auth
const user = useSupabaseUser();
const client = useSupabaseClient();

// readonly
const PROFILE = ref();
const USERNAME: globalThis.Ref<string> = computed(() => {
	return PROFILE.value ? PROFILE.value.username : "username";
});

const pastSessions = ref([])
watchEffect(async () => {
	if (user.value) {
		PROFILE.value = await getProfile(user.value.id);
                fetchSessions()

	}
});

async function getProfile(userId: string) {
	const { data, error } = await client
		.from("profile")
		.select()
		.eq("user_id", userId)
		.single();
	if (error) {
		console.log(error);
		console.log(
			"no profile for users found. user needs to setup profile"
		);
	}
	return data;
}

async function fetchSessions(){
        const {data, error} = await client.from('sessions_with_profile').select()
        if(error){
                console.log(error)
        }
        console.log(data)
        pastSessions.value = data
}
</script>
