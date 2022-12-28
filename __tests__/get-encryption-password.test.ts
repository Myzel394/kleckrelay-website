import getEncryptionPassword from "../src/utils/get-encryption-password"

describe("getEncryptionPassword", () => {
	it("is defined", () => {
		expect(getEncryptionPassword).toBeDefined()
	})

	it("returns a string", async () => {
		const result = await getEncryptionPassword("test@kleckrelay.example", "password", "salt")

		expect(typeof result).toBe("string")
	})
})
