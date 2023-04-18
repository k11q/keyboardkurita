import type { Database } from './../../supabase/schema';
import { serverSupabaseClient } from '#supabase/server';

export type SessionsInsert = Database['public']['Tables']['sessions']['Insert'];
export type CharacterPerformanceInsert =
	Database['public']['Tables']['character_performance']['Insert'];
export type WordPerformanceInsert =
	Database['public']['Tables']['word_performance']['Insert'];
export type IntervalLogsInsert =
	Database['public']['Tables']['interval_logs']['Insert'];
export type KeystrokeLogsInsert =
	Database['public']['Tables']['keystroke_logs']['Insert'];

export async function insertSessions(insertData: SessionsInsert) {
	const client = serverSupabaseClient(event);

	const { data, error } = await client
		.from('sessions')
		.insert(insertData);
	if (error) {
		return error;
	}
	return data;
}
