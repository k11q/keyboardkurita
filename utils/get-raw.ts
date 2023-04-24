export const getRaw = (totalCharacters: number, elapsedTime: number): number => {
	return parseFloat(
		(totalCharacters / 5 / (elapsedTime / 1000 / 60)).toFixed(2)
	);
};