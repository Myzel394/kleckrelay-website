import {useParams} from "react-router-dom"
import {AxiosError} from "axios"
import React, {ReactElement} from "react"

import {useQuery} from "@tanstack/react-query"
import {Box, Grid, List, Typography} from "@mui/material"

import {Report} from "~/server-types"
import {getReport} from "~/apis"
import {DecryptReport} from "~/components"
import ProxiedImagesListItem from "~/route-widgets/ReportDetailRoute/ProxiedImagesListItem"
import QueryResult from "~/components/QueryResult"
import SimplePage from "~/components/SimplePage"
import SinglePixelImageTrackersListItem from "~/route-widgets/ReportDetailRoute/SinglePixelImageTrackersListItem"

export default function ReportDetailRoute(): ReactElement {
	const params = useParams()

	const query = useQuery<Report, AxiosError>(["get_report", params.id], () =>
		getReport(params.id as string),
	)

	return (
		<SimplePage title="Report Details">
			<QueryResult<Report> query={query}>
				{encryptedReport => (
					<DecryptReport
						encryptedContent={encryptedReport.encryptedContent}
					>
						{report => (
							<Grid container spacing={4}>
								<Grid item xs={12}>
									<Typography variant="h6" component="h2">
										Email information
									</Typography>
									<Grid container columnSpacing={4}>
										<Grid item xs={12} md={6} lg={4}>
											<Box component="dl">
												<Typography
													variant="overline"
													component="dt"
												>
													From
												</Typography>
												<Typography
													variant="body1"
													component="dd"
												>
													{
														report.messageDetails
															.meta.from
													}
												</Typography>
											</Box>
										</Grid>
										<Grid item xs={12} md={6} lg={4}>
											<Box component="dl">
												<Typography
													variant="overline"
													component="dt"
												>
													To
												</Typography>
												<Typography
													variant="body1"
													component="dd"
												>
													{
														report.messageDetails
															.meta.to
													}
												</Typography>
											</Box>
										</Grid>
										<Grid item xs={12} lg={4}>
											<Box component="dl">
												<Typography
													variant="overline"
													component="dt"
												>
													Subject
												</Typography>
												<Typography
													variant="body1"
													component="dd"
												>
													{
														report.messageDetails
															.content.subject
													}
												</Typography>
											</Box>
										</Grid>
									</Grid>
								</Grid>
								<Grid item>
									<Typography variant="h6" component="h2">
										Trackers
									</Typography>
									<List>
										<SinglePixelImageTrackersListItem
											images={
												report.messageDetails.content
													.singlePixelImages
											}
										/>
										<ProxiedImagesListItem
											images={
												report.messageDetails.content
													.proxiedImages
											}
										/>
									</List>
								</Grid>
							</Grid>
						)}
					</DecryptReport>
				)}
			</QueryResult>
		</SimplePage>
	)
}
