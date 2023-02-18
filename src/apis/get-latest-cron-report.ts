import {ServerCronReport} from "~/server-types"
import {client} from "~/constants/axios-client"

export default async function getLatestCronReport(): Promise<ServerCronReport> {
	const {data} = await client.get(
		`${import.meta.env.VITE_SERVER_BASE_URL}/v1/admin/cron-report/latest/`,
		{
			withCredentials: true,
		},
	)

	return data
}
