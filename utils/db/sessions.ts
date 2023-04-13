import type { Database } from "./../../supabase/schema";
import { serverSupabaseClient } from "#supabase/server";

type SessionsInsert = Database["public"]["Tables"]["sessions"]["Insert"];

async function insertSessions(insertData: SessionsInsert) {
	const client = serverSupabaseClient(event);

	const { data, error } = await client
		.from("sessions")
		.insert(insertData);
	if (error) {
		console.log(error);
	}
}

export { insertSessions };
