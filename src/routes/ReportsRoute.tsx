import {ReactElement} from "react"
import {AxiosError} from "axios"

import {useQuery} from "@tanstack/react-query"
import {List} from "@mui/material"

import {PaginationResult, Report} from "~/server-types"
import {getReports} from "~/apis"
import {WithEncryptionRequired} from "~/hocs"
import {DecryptReport} from "~/components"
import QueryResult from "~/components/QueryResult"
import ReportInformationItem from "~/route-widgets/ReportsRoute/ReportInformationItem"

function ReportsRoute(): ReactElement {
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
								<ReportInformationItem
									report={report}
									key={report.id}
								/>
							)}
						</DecryptReport>
					))}
				</List>
			)}
		</QueryResult>
	)
}

export default WithEncryptionRequired(ReportsRoute)
