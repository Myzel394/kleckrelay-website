import Crypto from "crypto-js"

export default function decryptString(value: string, password: string): string {
	return Crypto.AES.decrypt(value, password).toString(Crypto.enc.Utf8)
}
