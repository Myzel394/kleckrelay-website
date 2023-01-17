import {ReactElement, useContext} from "react"
import {useAsync} from "react-use"

import {DecryptedReportContent, Report, ServerSettings} from "~/server-types"
import decryptReport from "~/apis/helpers/decrypt-report"

import {AuthContext} from "../AuthContext"
import {useLoaderData} from "react-router-dom"

interface DecryptReportPropsBase {
	encryptedContent?: string
	reports?: Report[]
	children: (report: DecryptedReportContent | DecryptedReportContent[]) => ReactElement
}

interface DecryptReportPropsEncryptedContent {
	encryptedContent: string
	children: (report: DecryptedReportContent) => ReactElement
}

interface DecryptReportPropsReports {
	reports: Report[]
	children: (reports: DecryptedReportContent[]) => ReactElement
}

export type DecryptReportProps = DecryptReportPropsBase &
	(DecryptReportPropsEncryptedContent | DecryptReportPropsReports)

export default function DecryptReport({
	encryptedContent,
	reports,
	children: render,
}: DecryptReportProps): ReactElement {
	const serverSettings = useLoaderData() as ServerSettings
	const {_decryptUsingPrivateKey} = useContext(AuthContext)

	const {value} = useAsync(async () => {
		const decrypt = async (content: string): Promise<DecryptedReportContent> =>
			decryptReport(content, _decryptUsingPrivateKey, serverSettings.publicKey)

		if (encryptedContent) {
			return decrypt(encryptedContent)
		} else {
			return await Promise.all(reports!.map(report => decrypt(report.encryptedContent)))
		}
	}, [encryptedContent, reports])

	if (!value) {
		return <></>
	}

	return render(value)
}
