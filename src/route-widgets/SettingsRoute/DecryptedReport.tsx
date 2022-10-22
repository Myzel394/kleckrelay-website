import {ReactElement, useContext} from "react"
import {useAsync} from "react-use"
import camelcaseKeys from "camelcase-keys"

import AuthContext from "~/AuthContext/AuthContext"

export interface DecryptedReportProps {
	encryptedContent: string
}

export default function DecryptedReport({
	encryptedContent,
}: DecryptedReportProps): ReactElement {
	const {_decryptUsingPrivateKey} = useContext(AuthContext)

	const {value} = useAsync(async () => {
		const message = await _decryptUsingPrivateKey(encryptedContent)
		return camelcaseKeys(JSON.parse(message))
	}, [encryptedContent])

	if (!value) {
		return <></>
	}

	console.log(value)

	return <></>
}
