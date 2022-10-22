import {ReactElement} from "react"
import {AxiosError} from "axios"

import {useQuery} from "@tanstack/react-query"
import {List, ListItem, ListItemText} from "@mui/material"

import {PaginationResult, Report} from "~/server-types"
import {getReports} from "~/apis"
import DecryptReport from "~/route-widgets/SettingsRoute/DecryptReport"
import QueryResult from "~/components/QueryResult"

export default function ReportsRoute(): ReactElement {
	const query = useQuery<PaginationResult<Report>, AxiosError>(
		["get_reports"],
		getReports,
	)

	return (
		<QueryResult<PaginationResult<Report>> query={query}>
			{result => (
				<List>
					{result.items.map(report => (
						<DecryptReport
							key={report.id}
							encryptedContent={report.encryptedContent}
						>
							{report => (
								<ListItem>
									<ListItemText
										primary={
											report.messageDetails.content
												.subject
										}
										secondary={`${report.messageDetails.meta.from} -> ${report.messageDetails.meta.to}`}
									></ListItemText>
								</ListItem>
							)}
						</DecryptReport>
					))}
				</List>
			)}
		</QueryResult>
	)
}
