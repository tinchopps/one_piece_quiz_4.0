// services/supabaseClient.ts
import { createClient, PostgrestError } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://feuwpfmbhsdtlzrxjrsv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZldXdwZm1iaHNkdGx6cnhqcnN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQwNTk4NTgsImV4cCI6MjA2OTYzNTg1OH0.V7R3Y_tb7M7dG1HBs0W5M8fARWy7SydDhQb1wF-NTpY';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Tipos básicos
export interface UserRow { id: string; username: string; }
export interface ScoreRow { user_id: string; mode: 'free' | 'story'; score: number; updated_at?: string; users?: { username: string }; }

// Utilidad para identificar error de fila no encontrada (PostgREST single)
const isNoRowError = (err: PostgrestError | null) => err && (err.code === 'PGRST116' || err.details?.includes('Results contain 0 rows'));

export const RankingService = {
	async getOrCreateUser(username: string): Promise<UserRow> {
		// Intentar obtener
		const { data: existing, error: selErr } = await supabase
			.from('users')
			.select('id, username')
			.eq('username', username)
			.maybeSingle();
		if (existing) return existing as UserRow;
		if (selErr && !isNoRowError(selErr)) throw selErr;
		// Crear
		const { data: created, error: insErr } = await supabase
			.from('users')
			.insert({ username })
			.select('id, username')
			.single();
		if (insErr || !created) throw insErr || new Error('No se pudo crear usuario');
		return created as UserRow;
	},

	async getUserScore(username: string, mode: 'free' | 'story'): Promise<number | null> {
		const { data, error } = await supabase
			.from('scores')
			.select('score, users!inner(username)')
			.eq('users.username', username)
			.eq('mode', mode)
			.maybeSingle();
		if (error && !isNoRowError(error)) {
			console.warn('[Ranking] getUserScore error', error.message);
			return null;
		}
		return data?.score ?? null;
	},

	async updateBestScore(userId: string, mode: 'free' | 'story', score: number): Promise<void> {
		// Leer existente
		const { data: existing, error: exErr } = await supabase
			.from('scores')
			.select('score')
			.eq('user_id', userId)
			.eq('mode', mode)
			.maybeSingle();
		if (exErr && !isNoRowError(exErr)) {
			console.warn('[Ranking] fetch existing error', exErr.message);
		}
		if (existing && existing.score >= score) return; // No mejora
		if (existing) {
			const { error: updErr } = await supabase
				.from('scores')
				.update({ score, updated_at: new Date().toISOString() })
				.eq('user_id', userId)
				.eq('mode', mode);
			if (updErr) console.warn('[Ranking] update error', updErr.message);
		} else {
			const { error: insErr } = await supabase
				.from('scores')
				.insert({ user_id: userId, mode, score });
			if (insErr) console.warn('[Ranking] insert error', insErr.message);
		}
	},

	async getTopScores(mode: 'free' | 'story', limit = 50): Promise<Array<{ username: string; score: number }>> {
		const { data, error } = await supabase
			.from('scores')
			.select('score, users!inner(username)')
			.eq('mode', mode)
			.order('score', { ascending: false })
			.limit(limit);
		if (error) {
			console.warn('[Ranking] getTopScores error', error.message);
			return [];
		}
		return (data || []).map(r => ({ username: (r as any).users.username, score: (r as any).score }));
	},

	async getUserRank(username: string, mode: 'free' | 'story'): Promise<number | null> {
		const userScore = await this.getUserScore(username, mode);
		if (userScore == null) return null;
		const { count, error } = await supabase
			.from('scores')
			.select('*', { count: 'exact', head: true })
			.eq('mode', mode)
			.gt('score', userScore);
		if (error) {
			console.warn('[Ranking] getUserRank error', error.message);
			return null;
		}
		return (count ?? 0) + 1;
	}
};
