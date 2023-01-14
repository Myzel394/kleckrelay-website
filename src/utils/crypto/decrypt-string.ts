import {AES, enc} from "crypto-js"

export default function decryptString(
	ciphertext: string,
	secret: CryptoJS.lib.WordArray | string,
): string {
	const bytes = AES.decrypt(ciphertext, secret.toString())

	return bytes.toString(enc.Utf8)
}
