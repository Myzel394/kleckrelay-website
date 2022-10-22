import {ReactElement, useContext} from "react"
import {useAsync} from "react-use"
import camelcaseKeys from "camelcase-keys"

import {DecryptedReportContent} from "~/server-types"
import AuthContext from "~/AuthContext/AuthContext"
import parseDecryptedReport from "~/apis/helpers/parse-decrypted-report"

export interface DecryptReportProps {
	encryptedContent: string
	children: (report: DecryptedReportContent) => ReactElement
}

export default function DecryptReport({
	encryptedContent,
	children: render,
}: DecryptReportProps): ReactElement {
	const {_decryptUsingPrivateKey} = useContext(AuthContext)

	const {value} = useAsync(async () => {
		const message = await _decryptUsingPrivateKey(encryptedContent)
		const content = camelcaseKeys(JSON.parse(message))

		return parseDecryptedReport(content)
	}, [encryptedContent])

	if (!value) {
		return <></>
	}

	return render(value)
}
