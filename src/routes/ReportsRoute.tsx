import {ReactElement, useState} from "react"
import {AxiosError} from "axios"
import {MdList} from "react-icons/md"
import {FaMask} from "react-icons/fa"
import groupArray from "group-array"
import sortArray from "sort-array"

import {useQuery} from "@tanstack/react-query"
import {
	InputAdornment,
	List,
	MenuItem,
	TextField,
	Typography,
} from "@mui/material"

import {DecryptedReportContent, PaginationResult, Report} from "~/server-types"
import {getReports} from "~/apis"
import {WithEncryptionRequired} from "~/hocs"
import {DecryptReport} from "~/components"
import QueryResult from "~/components/QueryResult"
import ReportInformationItem from "~/route-widgets/ReportsRoute/ReportInformationItem"
import SimplePage from "~/components/SimplePage"

enum SortingView {
	List = "List",
	GroupByAlias = "GroupByAlias",
}

const SORTING_VIEW_NAME_MAP: Record<SortingView, string> = {
	[SortingView.List]: "List reports by their date",
	[SortingView.GroupByAlias]: "Group reports by their aliases",
}

const SORTING_VIEW_ICON_MAP: Record<SortingView, ReactElement> = {
	[SortingView.List]: <MdList />,
	[SortingView.GroupByAlias]: <FaMask />,
}

function ReportsRoute(): ReactElement {
	const query = useQuery<PaginationResult<Report>, AxiosError>(
		["get_reports"],
		getReports,
	)

	const [sortingView, setSortingView] = useState<SortingView>(
		SortingView.List,
	)

	return (
		<SimplePage
			title="Reports"
			pageOptionsActions={
				<TextField
					value={sortingView}
					onChange={event =>
						setSortingView(event.target.value as SortingView)
					}
					label="Sorting"
					id="sorting"
					InputProps={{
						startAdornment: (
							<InputAdornment position="start">
								{SORTING_VIEW_ICON_MAP[sortingView]}
							</InputAdornment>
						),
					}}
					select
				>
					{Object.keys(SORTING_VIEW_NAME_MAP).map(name => (
						<MenuItem key={name} value={name}>
							{SORTING_VIEW_NAME_MAP[name as SortingView]}
						</MenuItem>
					))}
				</TextField>
			}
		>
			<QueryResult<PaginationResult<Report>> query={query}>
				{result => (
					<List>
						<DecryptReport reports={result.items}>
							{reports => (
								<>
									{(() => {
										switch (sortingView) {
											case SortingView.List:
												return sortArray(
													reports as DecryptedReportContent[],
													{
														by: "messageDetails.meta.createdAt",
														order: "desc",
													},
												).map(report => (
													<ReportInformationItem
														report={report}
														key={report.id}
													/>
												))

											case SortingView.GroupByAlias:
												return Object.entries(
													groupArray(
														reports as DecryptedReportContent[],
														"messageDetails.meta.to",
													),
												).map(
													([alias, reports]: [
														string,
														DecryptedReportContent[],
													]) => (
														<>
															<Typography
																variant="caption"
																component="h2"
															>
																{alias}
															</Typography>
															{reports.map(
																report => (
																	<ReportInformationItem
																		report={
																			report
																		}
																		key={
																			report.id
																		}
																	/>
																),
															)}
														</>
													),
												)
										}
									})()}
								</>
							)}
						</DecryptReport>
					</List>
				)}
			</QueryResult>
		</SimplePage>
	)
}

export default WithEncryptionRequired(ReportsRoute)
