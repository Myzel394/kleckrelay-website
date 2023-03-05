type TranslationFunction = (key: string) => string

export default function createEnumMapFromTranslation<T extends Record<string, string>>(
	prefix: string,
	TEnum: T,
): (callback: TranslationFunction) => Record<keyof T, string> {
	return callback =>
		Object.fromEntries(
			Object.values(TEnum).map(key => [key, callback(`${prefix}.${key}`)]),
		) as Record<keyof T, string>
}
