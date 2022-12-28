import Crypto from "crypto-js"

export default function encryptString(value: string, key: CryptoKey): string {
	return Crypto.AES.encrypt(value).toString()
}
