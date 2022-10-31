import {PaginationResult, Report} from "~/server-types"
import {client} from "~/constants/axios-client"

export default async function getReports(): Promise<PaginationResult<Report>> {
	const {data} = await client.get(
		`${import.meta.env.VITE_SERVER_BASE_URL}/report`,
		{
			withCredentials: true,
		},
	)

	return data
}