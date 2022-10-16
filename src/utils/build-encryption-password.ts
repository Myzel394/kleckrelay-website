export default function buildEncryptionPassword(
	password: string,
	email: string,
): string {
	return `${password}-blablabla-do-not-bruteforce-passwords-${email}`
}
