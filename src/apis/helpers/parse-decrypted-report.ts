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
			content: {
				...report.messageDetails.content,
				proxiedImages: report.messageDetails.content.proxiedImages.map(
					image => ({
						...image,
						createdAt: new Date(image.createdAt),
					}),
				),
			},
		},
	}
}
