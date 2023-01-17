import {readCleartextMessage, readKey, verify} from "openpgp"

// Extracts the message from a signed message
// Automatically verifies the signature, if it fails, an error is thrown
export default async function extractCleartextFromSignedMessage(
	signedMessage: string,
	publicKeyInPEM: string,
): Promise<string> {
	const publicKey = await readKey({
		armoredKey: publicKeyInPEM,
	})
	const message = await readCleartextMessage({
		cleartextMessage: signedMessage,
	})
	const result = await verify({
		// @ts-ignore: The example shows this exact usage
		message: message,
		verificationKeys: publicKey,
	})

	const {verified} = result.signatures[0]

	await verified

	return message.getText()
}
