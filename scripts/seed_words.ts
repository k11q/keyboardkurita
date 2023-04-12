//script for seeding words into supabase postgres db
import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import "dotenv/config";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const CHUNK_SIZE = 1000;

async function upsertWords(words) {
  const chunkCount = Math.ceil(words.length / CHUNK_SIZE);

  for (let i = 0; i < chunkCount; i++) {
    const start = i * CHUNK_SIZE;
    const end = Math.min(start + CHUNK_SIZE, words.length);
    const chunk = words.slice(start, end);

    try {
      const { data, error } = await supabase
        .from("words")
        .upsert(chunk, { onConflict: "word" });

      if (error) {
        console.error(`Error upserting chunk ${i + 1} of ${chunkCount}:`, error);
      } else {
        console.log(`Chunk ${i + 1} of ${chunkCount} upserted successfully.`);
      }
    } catch (err) {
      console.error(`Error upserting chunk ${i + 1} of ${chunkCount}:`, err);
    }
  }
}

function processWordsCSV(csvData) {
  const lines = csvData.trim().split("\n");
  const words = [];

  // Start from 1 to skip the header line
  for (let i = 1; i < lines.length; i++) {
    const [word, count] = lines[i].split(",");
    words.push({
      word,
      count: parseInt(count, 10),
      length: word.length,
    });
  }

  return words;
}

fs.readFile("words.csv", "utf-8", (err, data) => {
  if (err) {
    console.error("Error reading words.csv:", err);
    return;
  }

  const wordsToInsert = processWordsCSV(data);
  upsertWords(wordsToInsert);
});
