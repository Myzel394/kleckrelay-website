import camelcaseKeys from "camelcase-keys"
import update from "immutability-helper"

import {AuthContextType} from "~/components"
import {CronReport} from "~/server-types"
import {extractCleartextFromSignedMessage} from "~/utils"

export default async function decryptCronReportData(
	signedMessage: string,
	decryptContent: AuthContextType["_decryptUsingPrivateKey"],
	publicKeyInPEM: string,
): Promise<CronReport["reportData"]> {
	const encryptedMessage = await extractCleartextFromSignedMessage(signedMessage, publicKeyInPEM)

	return update(
		camelcaseKeys(
			JSON.parse(await decryptContent(encryptedMessage)) as CronReport["reportData"],
			{
				deep: true,
			},
		),
		{
			report: {
				startedAt: {
					$apply: startedAt => new Date(startedAt),
				},
				finishedAt: {
					$apply: finishedAt => new Date(finishedAt),
				},
			},
		},
	)
}
