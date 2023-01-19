import passwordGenerator from "secure-random-password"

export default function generateEncryptionPassword(): string {
	// 16 characters ^ 64 combinations results in an entropy of 256 bits
	return passwordGenerator.randomPassword({
		length: 64,
		characters: "0123456789ABCDEF",
	})
}
