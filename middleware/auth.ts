export default defineNuxtRouteMiddleware(async (to, _from) => {
	const user = useSupabaseUser();
	const client = useSupabaseClient();
      
	if (!user.value) {
		return navigateTo('/login');
	}else {
		const {data:profile} = await client.from('profile').select().eq('user_id', user.value.id).single();
		if (!profile){
			return navigateTo('/set-username');
		}
	}
});
      