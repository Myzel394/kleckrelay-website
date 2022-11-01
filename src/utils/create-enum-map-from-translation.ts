export default function createEnumMapFromTranslation<T extends Record<string, string>>(
	prefix: string,
	TEnum: T,
): Record<keyof T, string> {
	return Object.fromEntries(Object.values(TEnum).map(key => [key, `${prefix}.${key}`])) as Record<
		keyof T,
		string
	>
}
