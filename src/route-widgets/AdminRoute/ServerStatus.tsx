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

function ServerStatus(): ReactElement {
	const serverSettings = useLoaderData() as ServerSettings
	const {t} = useTranslation()
	const {_decryptUsingPrivateKey} = useContext(AuthContext)

	const query = useQuery<CronReport, AxiosError>(["get_latest_cron_report"], async () => {
		const encryptedReport = await getLatestCronReport()

		;(encryptedReport as any as CronReport).reportData = await decryptCronReportData(
			encryptedReport.reportData.encryptedReport,
			_decryptUsingPrivateKey,
			serverSettings.publicKey,
		)

		return encryptedReport as any as CronReport
	})

	return (
		<QueryResult<CronReport> query={query}>
			{report => {
				const thresholdDate = subDays(new Date(), MAX_REPORT_DAY_THRESHOLD)

				if (report.createdAt < thresholdDate) {
					return (
						<Alert severity="warning">
							{t("routes.AdminRoute.serverStatus.noRecentReports", {
								date: format(new Date(report.createdAt), "Pp"),
							})}
						</Alert>
					)
				}

				if (report.reportData.report.status === "error") {
					return (
						<Alert severity="error">
							{t("routes.AdminRoute.serverStatus.error", {
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
						{t("routes.AdminRoute.serverStatus.success", {
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
