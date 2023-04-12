import process from "process";
import fs from "node:fs";
import readline from "readline";
import { bisectLeft } from "d3-array";
import os from "os";

export default defineEventHandler(async (e) => {
	const query = getQuery(e);

	const limit = query.limit || 5000;
	const num_words = query.num || 25;
	const selected_char = query.char || "";

	async function loadIndexData() {
		const indexData = {};
		const fileStream = fs.createReadStream("public/data/dataset3_index.jsonl");

		const rl = readline.createInterface({
			input: fileStream,
			crlfDelay: Infinity,
		});

		let lineNumber = 0;
		for await (const line of rl) {
			if (lineNumber < limit) {
				const [key, value] = Object.entries(
					JSON.parse(line.trim())
				)[0];
				indexData[key] = value;
			} else {
				break;
			}
			lineNumber++;
		}

		return indexData;
	}

	function weightedChoice(indices, cumWeights) {
		const r = Math.random() * cumWeights[cumWeights.length - 1];
		const idx = bisectLeft(cumWeights, r);
		return indices[idx];
	}

	function readEntryFromFile(fd, byteOffset, callback) {
		const buffer = Buffer.alloc(200);
		fs.read(
			fd,
			buffer,
			0,
			buffer.length,
			byteOffset,
			(err, bytesRead) => {
				if (err) {
					callback(err);
				} else {
					const entry = JSON.parse(
						buffer
							.slice(0, bytesRead)
							.toString()
							.split("\n")[0]
					);
					callback(null, entry);
				}
			}
		);
	}

	function checkContainSelectedChar(word) {
		if (word.includes(selected_char)) {
			return true;
		}
		return false;
	}
	const indexData = await loadIndexData(limit);
	const indices = Object.keys(indexData);

	const cumWeights = [];
	let totalWeight = 0;
	for (let i = 0; i < indices.length; i++) {
		totalWeight += 1 / (i + 1);
		cumWeights.push(totalWeight);
	}

	const selectedWords = [];
	const selectedWordObjects = [];
	const selectedIndices = new Set();

	const fd = fs.openSync("public/data/dataset3.jsonl", "r");

	while (selectedWords.length < num_words) {
		const batchIndices = new Set();
		const batchPromises = [];

		while (batchIndices.size < 100) {
			const index = weightedChoice(indices, cumWeights);

			if (!selectedIndices.has(index)) {
				batchIndices.add(index);
				selectedIndices.add(index);
				const byteOffset = indexData[index];
				batchPromises.push(
					new Promise((resolve, reject) => {
						readEntryFromFile(
							fd,
							byteOffset,
							(err, entry) => {
								if (err)
									reject(
										err
									);
								else
									resolve(
										entry
									);
							}
						);
					})
				);
			}
		}

		const batchResults = await Promise.all(batchPromises);
		for (const entry of batchResults) {
			const word = Object.keys(entry)[0];
			if (
				selectedWords.length < num_words &&
				(selected_char
					? checkContainSelectedChar(word)
					: true)
			) {
				selectedWords.push(word);
				selectedWordObjects.push({
					word: word,
					metadata: entry[word],
				});
			}
		}
	}

	fs.closeSync(fd);

	const returnVal = {all_words:selectedWords,data:[...selectedWordObjects]}
	return (returnVal);
});
