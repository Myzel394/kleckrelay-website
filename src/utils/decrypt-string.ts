import Crypto from "crypto-js"

export default function decryptString(
	ciphertext: string,
	password: string,
): string {
	const bytes = Crypto.AES.decrypt(ciphertext, password)

	return bytes.toString(Crypto.enc.Utf8)
}
