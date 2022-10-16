import Crypto from "crypto-js"

export default function encryptString(value: string, password: string): string {
	return Crypto.AES.encrypt(value, password).toString()
}
