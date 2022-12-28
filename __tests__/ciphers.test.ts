import {decryptString, encryptString} from "../src/utils"
import getEncryptionPassword from "../src/utils/get-encryption-password"

describe("ciphers", () => {
	const email = "test@kleckrelay.example"
	const password = "password"
	const salt = "salt"

	it("encryption work", async () => {
		const secret = await getEncryptionPassword(email, password, salt)

		const encrypted = encryptString("test", secret)

		expect(typeof encrypted).toBe("string")
	})

	it("encryption and decryption work", async () => {
		const secret = await getEncryptionPassword(email, password, salt)

		const message = "test"
		const encrypted = encryptString(message, secret)

		const decrypted = decryptString(encrypted, secret)

		expect(decrypted).toBe(message)
	})
})
