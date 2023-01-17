import camelcaseKeys from "camelcase-keys"
import update from "immutability-helper"

import {DecryptedReportContent} from "~/server-types"
import {AuthContextType} from "~/components"
import {extractCleartextFromSignedMessage} from "~/utils"

export default async function decryptReport(
	signedMessage: string,
	decryptContent: AuthContextType["_decryptUsingPrivateKey"],
	publicKeyInPEM: string,
): Promise<DecryptedReportContent> {
	const encryptedMessage = await extractCleartextFromSignedMessage(signedMessage, publicKeyInPEM)

	return update<DecryptedReportContent>(
		camelcaseKeys(JSON.parse(await decryptContent(encryptedMessage)), {
			deep: true,
		}),
		{
			messageDetails: {
				meta: {
					createdAt: {
						$apply: createdAt => new Date(createdAt),
					},
				},
				content: {
					proxiedImages: {
						$apply: (
							proxiedImages: DecryptedReportContent["messageDetails"]["content"]["proxiedImages"],
						) =>
							proxiedImages.map(image => ({
								...image,
								createdAt: new Date(image.createdAt),
							})),
					},
				},
			},
		},
	)
}
