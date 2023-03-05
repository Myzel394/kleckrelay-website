import {ReactElement, useContext} from "react"
import {AxiosError} from "axios"
import {useLoaderData} from "react-router-dom"
import {useTranslation} from "react-i18next"
import format from "date-fns/format"
import formatRelative from "date-fns/formatRelative"
import subDays from "date-fns/subDays"

import {useQuery} from "@tanstack/react-query"
import {Alert} from "@mui/material"

import {WithEncryptionRequired} from "~/hocs"
import {CronReport, ServerSettings} from "~/server-types"
import {getLatestCronReport} from "~/apis"
import {AuthContext, QueryResult} from "~/components"
import decryptCronReportData from "~/apis/helpers/decrypt-cron-report-data"

const MAX_REPORT_DAY_THRESHOLD = 5

function ServerStatus(): ReactElement | null {
	const {t} = useTranslation("admin")
	const serverSettings = useLoaderData() as ServerSettings
	const {_decryptUsingPrivateKey} = useContext(AuthContext)

	const query = useQuery<CronReport | null, AxiosError>(["get_latest_cron_report"], async () => {
		const {code, detail, ...encryptedReport} = await getLatestCronReport()

		if (code === "error:cron_report:no_reports_found") {
			return null
		}

		;(encryptedReport as any as CronReport).reportData = await decryptCronReportData(
			encryptedReport.reportData.encryptedReport,
			_decryptUsingPrivateKey,
			serverSettings.publicKey,
		)

		return encryptedReport as any as CronReport
	})

	return (
		<QueryResult<CronReport | null> query={query}>
			{report => {
				if (report === null) {
					return null
				}

				const thresholdDate = subDays(new Date(), MAX_REPORT_DAY_THRESHOLD)

				if (report.createdAt < thresholdDate) {
					return (
						<Alert severity="warning">
							{t("serverStatus.noRecentReports", {
								date: format(new Date(report.createdAt), "Pp"),
							})}
						</Alert>
					)
				}

				if (report.reportData.report.status === "error") {
					return (
						<Alert severity="error">
							{t("serverStatus.error", {
								relativeDescription: formatRelative(
									new Date(report.createdAt),
									new Date(),
								),
							})}
						</Alert>
					)
				}

				return (
					<Alert severity="success">
						{t("serverStatus.success", {
							relativeDescription: formatRelative(
								new Date(report.createdAt),
								new Date(),
							),
						})}
					</Alert>
				)
			}}
		</QueryResult>
	)
}

export default WithEncryptionRequired(ServerStatus)
