import {ReactElement, useState} from "react"
import {MdList} from "react-icons/md"
import {FaMask} from "react-icons/fa"
import groupArray from "group-array"
import sortArray from "sort-array"

import {
	Grid,
	InputAdornment,
	MenuItem,
	TextField,
	Typography,
} from "@mui/material"

import {DecryptedReportContent} from "~/server-types"

import ReportInformationItem from "./ReportInformationItem"

export interface ReportsListProps {
	reports: DecryptedReportContent[]
}

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

export default function ReportsList({reports}: ReportsListProps): ReactElement {
	const [sortingView, setSortingView] = useState<SortingView>(
		SortingView.List,
	)

	return (
		<Grid direction="column" container spacing={4}>
			<Grid item>
				<Typography variant="h6" component="h2">
					Reports
				</Typography>
			</Grid>
			<Grid item>
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
			</Grid>
			<Grid item>
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
			</Grid>
		</Grid>
	)
}
