import {DecryptedReportContent} from "~/server-types"

export default function parseDecryptedReport(
	report: any,
): DecryptedReportContent {
	return {
		...report,
		messageDetails: {
			...report.messageDetails,
			meta: {
				...report.messageDetails.meta,
				createdAt: new Date(report.messageDetails.meta.createdAt),
			},
		},
	}
}
