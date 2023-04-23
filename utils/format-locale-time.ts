export default function formatLocaleTime(time: number) {
	return new Date(time).toISOString().toLocaleString();
}