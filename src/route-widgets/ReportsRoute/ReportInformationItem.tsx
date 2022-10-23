import {ReactElement} from "react"
import {useNavigate} from "react-router-dom"

import {ListItemButton, ListItemText} from "@mui/material"

import {DecryptedReportContent} from "~/server-types"

export interface ReportInformationItemProps {
	report: DecryptedReportContent
}

export default function ReportInformationItem({
	report,
}: ReportInformationItemProps): ReactElement {
	const navigate = useNavigate()

	return (
		<ListItemButton onClick={() => navigate(`/reports/${report.id}`)}>
			<ListItemText
				primary={
					report.messageDetails.content.subject ?? (
						<i>{"<No Subject>"}</i>
					)
				}
				secondary={`${report.messageDetails.meta.from} -> ${report.messageDetails.meta.to}`}
			/>
		</ListItemButton>
	)
}
