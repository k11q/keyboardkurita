import { promises as fs } from 'fs';
import path from 'path';
import type {
	CharLogStatus,
	WordType,
	CharacterMetadata,
	WordMetadata,
} from '@/types';

const getRandomWords = (
	allWords: string[],
	numWords: number,
	char: string
): string[] => {
	const wordsSet: Set<string> = new Set();

	const filteredWords = char
		? allWords.filter((word) =>
			word.split('').some((c) => char.includes(c))
		  )
		: allWords;

	if (filteredWords.length === 0) {
		throw new Error('No words found with the specified characters');
	}

	while (wordsSet.size < numWords) {
		const randomWord =
			filteredWords[
				Math.floor(Math.random() * filteredWords.length)
			];
		if (filteredWords.length >= numWords) {
			wordsSet.add(randomWord);
		} else {
			const wordArray = Array.from(wordsSet);
			wordArray.push(randomWord);
			wordsSet.clear();
			wordArray.forEach((word) => wordsSet.add(word));
		}
	}

	return Array.from(wordsSet);
};

const insertSpacerObject = (
	words: string[],
	wordObjects: WordMetadata[]
): void => {
	for (let i = 0; i < words.length - 1; i++) {
		wordObjects.splice(i * 2 + 1, 0, {
			word: ' ',
			characters: [
				{
					character: ' ',
					timing: 0,
					status: 'pending',
					char_index: 0,
					word_index: i,
				},
			],
			index: i,
			type: 'separator',
		});
	}
};

const generateWordsData = async (
	numWords: number,
	language: string,
	char: string
): Promise<{
	all_data: WordMetadata[];
	all_words: string[];
	data: WordMetadata[];
	num_characters: number;
	num_words: number;
}> => {
	const filePath = path.join(
		process.cwd(),
		'public',
		'languages',
		`${language}.json`
	);

	let languageData;
	let allWords;

	try {
		const fileContent = await fs.readFile(filePath, 'utf-8');
		languageData = JSON.parse(fileContent);
		allWords = languageData.words;
	} catch (error) {
		console.error('Error loading language file:', error);
		throw new Error('Language file not found or invalid');
	}

	const selectedWords = getRandomWords(allWords, numWords, char);

	const wordObjects: WordMetadata[] = selectedWords.map((word, index) => {
		const characters: CharacterMetadata[] = word
			.split('')
			.map((character, charIndex) => {
				return {
					character,
					timing: 0,
					status: 'pending',
					char_index: charIndex,
					word_index: index,
				};
			});

		return {
			word,
			characters,
			index,
			type: 'word',
		};
	});

	insertSpacerObject(selectedWords, wordObjects);

	const numCharacters = selectedWords.join('').length;

	return {
		all_data: wordObjects,
		all_words: selectedWords,
		data: wordObjects,
		num_characters: numCharacters,
		num_words: numWords,
	};
};

export default defineEventHandler(async (e) => {
	const { num, lang, char, difficulty } = getQuery(e);

	const numWords = parseInt(num as string) || 10;
	const language = (lang as string) || 'english';
	const characters = (char as string) || '';

	try {
		const returnVal = await generateWordsData(
			numWords,
			language,
			characters
		);
		const nextReturnVal = await generateWordsData(
			numWords,
			language,
			characters
		);

		return { ...returnVal, next_data: { ...nextReturnVal } };
	} catch (error) {
		console.error('Error generating words data:', error);
		// Return an appropriate error response or throw the error to be handled by your API framework
		throw error;
	}
});
