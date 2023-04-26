export function isQuickRestartShortcut(e: KeyboardEvent) {
	const key = e.key;
	return key === 'Tab';
}