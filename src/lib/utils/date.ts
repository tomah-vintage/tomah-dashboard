export function formatDate(dateString: string): string {
	const date = new Date(dateString);
	return date.toLocaleDateString('mn-MN', {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit'
	});
}

export function formatDateTime(dateString: string): string {
	const date = new Date(dateString);
	return date.toLocaleDateString('mn-MN', {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit'
	});
}

export function formatTime(dateString: string): string {
	const date = new Date(dateString);
	return date.toLocaleTimeString('mn-MN', {
		hour: '2-digit',
		minute: '2-digit'
	});
}