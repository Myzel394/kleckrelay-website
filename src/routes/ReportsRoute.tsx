import {ReactElement, useState} from "react"
import {AxiosError} from "axios"
import {MdList} from "react-icons/md"
import {FaMask} from "react-icons/fa"
import {useTranslation} from "react-i18next"
import groupArray from "group-array"
import sortArray from "sort-array"

import {useQuery} from "@tanstack/react-query"
import {InputAdornment, List, MenuItem, TextField, Typography} from "@mui/material"

import {DecryptedReportContent, PaginationResult, Report} from "~/server-types"
import {getReports} from "~/apis"
import {WithEncryptionRequired} from "~/hocs"
import {DecryptReport, QueryResult, SimplePage} from "~/components"
import {createEnumMapFromTranslation} from "~/utils"
import EmptyStateScreen from "~/route-widgets/ReportsRoute/EmptyStateScreen"
import ReportInformationItem from "~/route-widgets/ReportsRoute/ReportInformationItem"

enum SortingView {
	List = "List",
	GroupByAlias = "GroupByAlias",
}

const SORTING_VIEW_ICON_MAP: Record<SortingView, ReactElement> = {
	[SortingView.List]: <MdList />,
	[SortingView.GroupByAlias]: <FaMask />,
}
const SORTING_VIEW_NAME_MAP: Record<SortingView, string> = createEnumMapFromTranslation(
	"routes.ReportsRoute.pageActions.sort",
	SortingView,
)

function ReportsRoute(): ReactElement {
	const {t} = useTranslation()

	const query = useQuery<PaginationResult<Report>, AxiosError>(["get_reports"], getReports)

	const [sortingView, setSortingView] = useState<SortingView>(SortingView.List)

	return (
		<SimplePage
			title="Reports"
			pageOptionsActions={
				(query.data?.items?.length || 0) > 0 && (
					<TextField
						value={sortingView}
						onChange={event => setSortingView(event.target.value as SortingView)}
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
								{t(SORTING_VIEW_NAME_MAP[name as SortingView])}
							</MenuItem>
						))}
					</TextField>
				)
			}
		>
			<QueryResult<PaginationResult<Report>> query={query}>
				{result => (
					<List>
						<DecryptReport reports={result.items}>
							{reports => (
								<>
									{(() => {
										if (result.items.length === 0) {
											return <EmptyStateScreen />
										}

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
															{reports.map(report => (
																<ReportInformationItem
																	report={report}
																	key={report.id}
																/>
															))}
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
