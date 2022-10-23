import {ReactElement} from "react"
import {AxiosError} from "axios"

import {useQuery} from "@tanstack/react-query"
import {List} from "@mui/material"

import {DecryptedReportContent, PaginationResult, Report} from "~/server-types"
import {getReports} from "~/apis"
import {WithEncryptionRequired} from "~/hocs"
import {DecryptReport} from "~/components"
import QueryResult from "~/components/QueryResult"
import ReportsList from "~/route-widgets/ReportsRoute/ReportsList"

function ReportsRoute(): ReactElement {
	const query = useQuery<PaginationResult<Report>, AxiosError>(
		["get_reports"],
		getReports,
	)

	return (
		<QueryResult<PaginationResult<Report>> query={query}>
			{result => (
				<List>
					<DecryptReport reports={result.items}>
						{reports => (
							<ReportsList
								reports={reports as DecryptedReportContent[]}
							/>
						)}
					</DecryptReport>
				</List>
			)}
		</QueryResult>
	)
}

export default WithEncryptionRequired(ReportsRoute)
