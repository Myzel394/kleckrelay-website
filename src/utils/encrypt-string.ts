import Crypto from "crypto-js"

export default function encryptString(value: string, password: string): string {
	const key = `${password}-${process.env.NODE_PUBLIC_NEXT_PUBLIC_PUBLIC_ENCRYPTION_SAL}`

	return Crypto.AES.encrypt(value, key).toString()
}
