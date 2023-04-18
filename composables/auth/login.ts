//client only
const user = useSupabaseUser();
const client = useSupabaseAuthClient();
const router = useRouter();

export default async function login(
	provider: 'github' | 'google' | 'gitlab' | 'bitbucket'
) {
	const { error } = await client.auth.signInWithOAuth({
		provider,
	});
	if (error) {
		return alert('Something went wrong !');
	}
	router.push('/');
}
