import { Binding } from "../../../../../usr/share/astal/gjs";

export function assert<T>(
	value: T | undefined | null,
	message: string = "Assertion failed.",
): T {
	if (value == null) {
		throw message;
	}
	return value;
}

export function modify<T, R>(
	binding: T | Binding<T>,
	fn: (value: T) => R,
): R | Binding<R> {
	if (binding instanceof Binding) {
		return binding.as(fn);
	} else {
		return fn(binding);
	}
}

export function trunc(string: string, len: number): string {
	if (string == null) return "";
	else if (string.length > len) return string.substring(0, len - 1) + "…";
	else return string;
}

export function fuzzyQuery<T extends { name: string; keywords?: string[] }>(
	entries: T[],
	filter: string,
): T[] {
	if (filter.length === 0) return [...entries];

	let distances = entries.map(({ name, keywords }, i) => [
		i,
		Math.min(
			levenshteinDistance(filter, name),
			...(keywords?.map((k) => levenshteinDistance(filter, k)) ?? []),
		),
	]);
	distances.sort(([_a, distA], [_b, distB]) => distA - distB);
	return distances.map(([i]) => entries[i]);
}

export function levenshteinDistance(a: string, b: string): number {
	let matrix: number[][] = Array(a.length + 1)
		.fill(null)
		.map(() => Array(b.length + 1).fill(0));

	for (let i = 0; i <= a.length; i++) {
		matrix[i][0] = i;
	}
	for (let i = 0; i <= b.length; i++) {
		matrix[0][i] = i;
	}

	for (let i = 1; i <= a.length; i++) {
		for (let j = 1; j <= b.length; j++) {
			if (a[i - 1] === b[j - 1]) {
				matrix[i][j] = matrix[i - 1][j - 1];
			} else {
				matrix[i][j] =
					Math.min(matrix[i - 1][j], matrix[i][j - 1], matrix[i - 1][j - 1]) +
					1;
			}
		}
	}

	return matrix[a.length][b.length];
}
