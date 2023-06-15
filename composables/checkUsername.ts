const user = useSupabaseUser();
const client = useSupabaseClient();
const router = useRouter();

export default async function checkUsername() {
	if (!user.value) {
		return router.push("/login");
	} else {
		const { data: profile } = await client
			.from("profile")
			.select()
			.eq("user_id", user.value.id)
			.single();
		if (!profile) {
			return router.push("/set-username");
		}
	}
}
