import {useQuery} from "@tanstack/react-query"
import {ReactElement} from "react"
import {Report} from "~/server-types"
import {AxiosError} from "axios"
import {getReports} from "~/apis"
import DecryptedReport from "~/route-widgets/SettingsRoute/DecryptedReport"
import QueryResult from "~/components/QueryResult"

export default function ReportsRoute(): ReactElement {
	const query = useQuery<Array<Report>, AxiosError>(
		["get_reports"],
		getReports,
	)

	return (
		<QueryResult<Array<Report>> query={query}>
			{reports => (
				<>
					{reports.map(report => (
						<DecryptedReport
							key={report.id}
							encryptedNotes={report.encryptedNotes}
						/>
					))}
				</>
			)}
		</QueryResult>
	)
}
