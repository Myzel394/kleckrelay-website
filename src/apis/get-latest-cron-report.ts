import {CronReport} from "~/server-types"
import {client} from "~/constants/axios-client"

export default async function getLatestCronReport(): Promise<CronReport> {
	const {data} = await client.get(
		`${import.meta.env.VITE_SERVER_BASE_URL}/v1/cron-report/latest/`,
		{
			withCredentials: true,
		},
	)

	return data
}
