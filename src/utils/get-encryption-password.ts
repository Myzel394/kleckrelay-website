import * as CryptoJS from "crypto-js"

const SALT_SUFFIX = "accessing_data_you_are_not_allowed_to_is_a_crime"

export default async function getEncryptionPassword(
	email: string,
	password: string,
	salt: string,
): Promise<CryptoJS.lib.WordArray> {
	const cryptoSalt = `${salt}:${SALT_SUFFIX}`
	const cryptoPassword = `${password}-${email}`

	return CryptoJS.PBKDF2(cryptoPassword, cryptoSalt, {
		keySize: 512 / 32,
		iterations: process.env.NODE_ENV === "production" ? 100_394 : 1,
	})
}
