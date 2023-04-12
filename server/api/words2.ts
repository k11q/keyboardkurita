import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default defineEventHandler(async (e) => {
	const query = getQuery(e);

	const num_words = query.num || 25;
	const selected_char = query.char || "";

	async function checkContainSelectedChar() {
		const { data, error } = await supabase
			.from("words")
			.select("word, count")
			.ilike("word", `%${selected_char}%`)
			.range(0, num_words * 4 - 1);

		if (error) {
			console.error("Error fetching words:", error);
			return [];
		}

		// Calculate weights based on the counts
		const weightedData = data.map((entry) => ({
			...entry,
			weight: 1 / entry.count,
		}));

		// Sort by weight and take the top words
		const topWeightedData = weightedData
			.sort((a, b) => b.weight - a.weight)
			.slice(0, num_words);

		return topWeightedData.map((entry) => ({
			word: entry.word,
			metadata: entry.metadata,
		}));
	}

	const selectedWordObjects = await checkContainSelectedChar();
	const selectedWords = selectedWordObjects.map((entry) => entry.word);

	const returnVal = {
		all_words: selectedWords,
		data: [...selectedWordObjects],
	};
	return returnVal;
});
