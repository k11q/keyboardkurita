import process from 'process';
import fs from 'node:fs';
import readline from 'readline';
import { bisectLeft } from 'd3-array';
import os from 'os';
import type { CharLogStatus, WordType, CharacterMetadata, WordMetadata } from '@/types';

let allData: WordMetadata[] = [];

export default defineEventHandler(async (e) => {
	const query = getQuery(e);

	const limit: number = parseInt(query.limit as string) || 5000;
	const numWords: number = parseInt(query.num as string) || 10;
	const selected_char = (query.char as string) || '';
	const difficulty: 'easy' | 'medium' | 'hard' | 'extra_hard' =
		(query.difficulty as
			| 'easy'
			| 'medium'
			| 'hard'
			| 'extra_hard') || 'easy';

	async function loadIndexData() {
		const indexData = {};
		const fileStream = fs.createReadStream(
			'public/data/dataset3_index.jsonl'
		);

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
							.split('\n')[0]
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
		// Modify the weight calculation based on the difficulty level
		switch (difficulty) {
		case 'easy':
			totalWeight += 1 / (i + 1);
			break;
		case 'medium':
			totalWeight += 1 / Math.sqrt(i + 1);
			break;
		case 'hard':
			totalWeight += 1;
			break;
		case 'extra_hard':
			totalWeight += Math.sqrt(i + 1);
			break;
		default:
			totalWeight += 1 / (i + 1);
		}
		cumWeights.push(totalWeight);
	}

	const fd = fs.openSync('public/data/dataset3.jsonl', 'r');

	async function generateWords() {
		const selectedWords = [];
		const selectedWordObjects = [];
		const selectedIndices = new Set();

		while (selectedWords.length < numWords) {
			const batchIndices = new Set();
			const batchPromises = [];

			while (batchIndices.size < 100) {
				const index = weightedChoice(
					indices,
					cumWeights
				);

				if (!selectedIndices.has(index)) {
					batchIndices.add(index);
					selectedIndices.add(index);
					const byteOffset = indexData[index];
					batchPromises.push(
						new Promise(
							(resolve, reject) => {
								readEntryFromFile(
									fd,
									byteOffset,
									(
										err,
										entry
									) => {
										if (
											err
										)
											reject(
												err
											);
										else
											resolve(
												entry
											);
									}
								);
							}
						)
					);
				}
			}

			const batchResults = await Promise.all(batchPromises);
			for (const entry of batchResults) {
				const word = Object.keys(entry)[0];
				if (
					selectedWords.length < numWords &&
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

		const combinedString = selectedWords.join('');
		const numCharacters = combinedString.length;

		allData = [];
		const returnedAllData = fillData(selectedWords);

		return {
			all_data: returnedAllData,
			all_words: selectedWords,
			data: [...selectedWordObjects],
			num_characters: numCharacters,
			num_words: numWords,
		};
	}

	const returnVal = await generateWords();
	const nextReturnVal = await generateWords();

	fs.closeSync(fd);

	return { ...returnVal, next_data: { ...nextReturnVal } };
});

function fillData(words: string[]) {
	if (!words.length) {
		console.log('Error: no words found to fill.');
		return;
	}
	let wordCount = 0;
	for (const word of words) {
		const characters = word.split('');
		const charData: CharacterMetadata[] = [];
		// create char object
		const charCount = insertCharObject(
			wordCount,
			characters,
			charData
		);
		// push word object
		const type: WordType = 'word';
		insertWordObject(word, charData, wordCount, type);
		// push separator object
		insertSpacerObject(words, wordCount);

		wordCount++;
	}
	return allData;
}

function insertCharObject(
	wordCount: number,
	characters: string[],
	charData: CharacterMetadata[]
) {
	let charCount = 0;
	for (const char of characters) {
		charData.push({
			character: char,
			status: 'pending',
			index: charCount,
			word_index: wordCount,
		});
		charCount++;
	}
	return charCount;
}

function insertWordObject(
	word: string,
	charData: CharacterMetadata[],
	wordCount: number,
	type: WordType
) {
	allData.push({
		word: word,
		characters: charData,
		index: wordCount,
		type: type,
	});
}

function insertSpacerObject(words: string[], wordCount: number) {
	if (wordCount === words.length - 1) {
		return;
	}
	allData.push({
		word: ' ',
		characters: [
			{
				character: ' ',
				status: 'pending',
				index: 0,
				word_index: wordCount,
			},
		],
		index: wordCount,
		type: 'separator',
	});
}
