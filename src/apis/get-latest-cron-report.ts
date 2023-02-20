import {ServerCronReport} from "~/server-types"
import {client} from "~/constants/axios-client"

export type GetLatestCronReportResponse = ServerCronReport & {
	detail: string
	code: "error:cron_report:no_reports_found"
}

export default async function getLatestCronReport(): Promise<GetLatestCronReportResponse> {
	const {data} = await client.get(
		`${import.meta.env.VITE_SERVER_BASE_URL}/v1/admin/cron-report/latest/`,
		{
			withCredentials: true,
		},
	)

	return data
}
