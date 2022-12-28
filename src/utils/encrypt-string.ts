import {AES} from "crypto-js"

export default function encryptString(
	value: string,
	secret: CryptoJS.lib.WordArray | string,
): string {
	return AES.encrypt(value, secret.toString()).toString()
}
