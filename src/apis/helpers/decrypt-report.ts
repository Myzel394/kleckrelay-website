import camelcaseKeys from "camelcase-keys"
import update from "immutability-helper"

import {DecryptedReportContent} from "~/server-types"
import {AuthContextType} from "~/components"

export default async function decryptReport(
	encryptedContent: string,
	decryptContent: AuthContextType["_decryptUsingPrivateKey"],
): Promise<DecryptedReportContent> {
	return update<DecryptedReportContent>(
		camelcaseKeys(JSON.parse(await decryptContent(encryptedContent)), {
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
