import {ReactElement} from "react"
import {useNavigate} from "react-router-dom"

import {ListItemButton, ListItemText} from "@mui/material"

import {DecryptedReportContent} from "~/server-types"
import {useTranslation} from "react-i18next"

export interface ReportInformationItemProps {
	report: DecryptedReportContent
}

export default function ReportInformationItem({
	report,
}: ReportInformationItemProps): ReactElement {
	const navigate = useNavigate()
	const {t} = useTranslation()

	return (
		<ListItemButton onClick={() => navigate(`/reports/${report.id}`)}>
			<ListItemText
				primary={
					report.messageDetails.content.subject ?? (
						<i>{t("relations.report.emailMeta.emptySubject")}</i>
					)
				}
				secondary={t("relations.report.emailMeta.flow", {
					from: report.messageDetails.meta.from,
					to: report.messageDetails.meta.to,
				})}
			/>
		</ListItemButton>
	)
}
