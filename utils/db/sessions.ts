import type { Database } from './../../supabase/schema';
import { serverSupabaseClient } from '#supabase/server';
import type { WordLogStatus, CharLogStatus } from '~/types';

export type SessionsInsert = Database['public']['Tables']['sessions']['Insert'];
export type IntervalLogsInsert =
	Database['public']['Tables']['interval_logs']['Insert'];
type CharacterLogsInsertInferred =
	Database['public']['Tables']['character_logs']['Insert'];
export type CharacterLogsInsert = {
	[K in keyof CharacterLogsInsertInferred]: K extends 'status'
	? CharLogStatus : CharacterLogsInsertInferred[K];
	};
type WordLogsInsertInferred =
	Database['public']['Tables']['word_logs']['Insert'];
export type WordLogsInsert = {
	[K in keyof WordLogsInsertInferred]: K extends 'status'
	? WordLogStatus : WordLogsInsertInferred[K];
      };
