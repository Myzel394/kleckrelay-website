import {ReactElement, useState} from "react"
import {AxiosError} from "axios"
import {MdList} from "react-icons/md"
import {FaMask} from "react-icons/fa"
import {useTranslation} from "react-i18next"
import sortArray from "sort-array"

import {useQuery} from "@tanstack/react-query"
import {InputAdornment, List, MenuItem, TextField, Typography} from "@mui/material"

import {DecryptedReportContent, PaginationResult, Report} from "~/server-types"
import {getReports} from "~/apis"
import {DecryptReport, QueryResult, SimplePage} from "~/components"
import {createEnumMapFromTranslation} from "~/utils"
import {groupBy} from "lodash"
import {WithEncryptionRequired} from "~/hocs"
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

function ReportsRoute(): ReactElement {
	const {t} = useTranslation("reports")

	const sortingViewNameMap = createEnumMapFromTranslation(
		"pageActions.sort.values",
		SortingView,
	)(key => t(key))

	const query = useQuery<PaginationResult<Report>, AxiosError>(["get_reports"], getReports)

	const [sortingView, setSortingView] = useState<SortingView>(SortingView.List)

	return (
		<SimplePage
			title={t("title")}
			pageOptionsActions={
				(query.data?.items?.length || 0) > 0 && (
					<TextField
						value={sortingView}
						onChange={event => setSortingView(event.target.value as SortingView)}
						label={t("pageActions.sort.label")}
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
						{Object.keys(sortingViewNameMap).map(name => (
							<MenuItem key={name} value={name}>
								{t(sortingViewNameMap[name as SortingView])}
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
													groupBy(
														reports as DecryptedReportContent[],
														report => report.messageDetails.meta.to,
													),
												).map(
													([alias, reports]: [
														string,
														DecryptedReportContent[],
													]) => (
														<div key={alias}>
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
														</div>
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
