import {useParams} from "react-router-dom"
import {AxiosError} from "axios"
import {useTranslation} from "react-i18next"
import React, {ReactElement} from "react"

import {useQuery} from "@tanstack/react-query"
import {Button, List} from "@mui/material"

import {DecryptedReportContent, Report} from "~/server-types"
import {getReport} from "~/apis"
import {DecryptReport, SimpleOverlayInformation, SimplePageBuilder} from "~/components"
import {WithEncryptionRequired} from "~/hocs"
import {BsTrash} from "react-icons/bs"
import {MdDelete} from "react-icons/md"
import DeleteButton from "~/route-widgets/ReportDetailRoute/DeleteButton"
import ProxiedImagesListItem from "~/route-widgets/ReportDetailRoute/ProxiedImagesListItem"
import QueryResult from "~/components/QueryResult"
import SinglePixelImageTrackersListItem from "~/route-widgets/ReportDetailRoute/SinglePixelImageTrackersListItem"

function ReportDetailRoute(): ReactElement {
	const {t} = useTranslation()
	const params = useParams()

	const query = useQuery<Report, AxiosError>(["get_report", params.id], () =>
		getReport(params.id as string),
	)

	return (
		<SimplePageBuilder.Page
			title="Report Details"
			actions={query.data && <DeleteButton id={query.data.id} />}
		>
			<QueryResult<Report> query={query}>
				{encryptedReport => (
					<DecryptReport encryptedContent={encryptedReport.encryptedContent}>
						{report => (
							<SimplePageBuilder.MultipleSections>
								{[
									<SimplePageBuilder.Section
										key="information"
										label={t(
											"routes.ReportDetailRoute.sections.information.title",
										)}
									>
										<SimplePageBuilder.InformationContainer>
											{[
												<SimpleOverlayInformation
													key="from"
													label={t(
														"routes.ReportDetailRoute.sections.information.form.from.label",
													)}
												>
													{
														(report as DecryptedReportContent)
															.messageDetails.meta.from
													}
												</SimpleOverlayInformation>,

												<SimpleOverlayInformation
													key="to"
													label={t(
														"routes.ReportDetailRoute.sections.information.form.to.label",
													)}
												>
													{
														(report as DecryptedReportContent)
															.messageDetails.meta.to
													}
												</SimpleOverlayInformation>,

												<SimpleOverlayInformation
													key="subject"
													label={t(
														"routes.ReportDetailRoute.sections.information.form.subject.label",
													)}
												>
													{
														(report as DecryptedReportContent)
															.messageDetails.content.subject
													}
												</SimpleOverlayInformation>,
											]}
										</SimplePageBuilder.InformationContainer>
									</SimplePageBuilder.Section>,

									<SimplePageBuilder.Section
										key="trackers"
										label={t(
											"routes.ReportDetailRoute.sections.trackers.title",
										)}
									>
										<List>
											<SinglePixelImageTrackersListItem
												images={
													(report as DecryptedReportContent)
														.messageDetails.content.singlePixelImages
												}
											/>
											<ProxiedImagesListItem
												images={
													(report as DecryptedReportContent)
														.messageDetails.content.proxiedImages
												}
											/>
										</List>
									</SimplePageBuilder.Section>,
								]}
							</SimplePageBuilder.MultipleSections>
						)}
					</DecryptReport>
				)}
			</QueryResult>
		</SimplePageBuilder.Page>
	)
}

export default WithEncryptionRequired(ReportDetailRoute)
