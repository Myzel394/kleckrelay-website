import {ReactElement} from "react"
import {useNavigate} from "react-router-dom"
import {useTranslation} from "react-i18next"

import {ListItemButton, ListItemText} from "@mui/material"

import {DecryptedReportContent} from "~/server-types"

export interface ReportInformationItemProps {
	report: DecryptedReportContent
}

export default function ReportInformationItem({report}: ReportInformationItemProps): ReactElement {
	const {t} = useTranslation("reports")
	const navigate = useNavigate()

	return (
		<ListItemButton onClick={() => navigate(`/reports/${report.id}`)}>
			<ListItemText
				primary={
					report.messageDetails.content.subject || <i>{t("emailMeta.emptySubject")}</i>
				}
				secondary={t("emailMeta.flow", {
					from: report.messageDetails.meta.from,
					to: report.messageDetails.meta.to,
				})}
			/>
		</ListItemButton>
	)
}
