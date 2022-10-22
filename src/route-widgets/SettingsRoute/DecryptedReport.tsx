import {ReactElement} from "react"
import {useAsync} from "react-use"
import {useUser} from "~/hooks"
import {decrypt, readMessage, readPrivateKey} from "openpgp"

export interface DecryptedReportProps {
	encryptedNotes: string
}

export default function DecryptedReport({
	encryptedNotes,
}: DecryptedReportProps): ReactElement {
	const user = useUser()

	const {value} = useAsync(async () => {
		if (user.isDecrypted) {
			// @ts-ignore
			const key = await readPrivateKey({
				armoredKey: user.notes.privateKey,
			})
			const message = await readMessage({
				armoredMessage: encryptedNotes,
			})

			return await decrypt({
				message: message,
				decryptionKeys: key,
			})
		}
	}, [encryptedNotes])

	if (!value) {
		return <></>
	}

	return <div>{value}</div>
}
