export function isKeySpace(e: KeyboardEvent) {
	const key = e.key;
	return (key === ' ');
}