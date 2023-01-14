import {SerializedKeyPair, generateKey} from "openpgp"

export default async function generateKeys(): Promise<
	SerializedKeyPair<string> & {revocationCertificate: string}
> {
	return generateKey({
		type: "ecc",
		format: "armored",
		userIDs: [{name: "John Smith", email: "john@example.com"}],
		passphrase: "",
		rsaBits: process.env.NODE_ENV === "production" ? 4096 : 2048,
	})
}
