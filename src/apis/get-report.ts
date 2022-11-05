import {client} from "~/constants/axios-client"
import {Report} from "~/server-types"

export default async function getReport(id: string): Promise<Report> {
	const {data} = await client.get(`${import.meta.env.VITE_SERVER_BASE_URL}/v1/report/${id}`, {
		withCredentials: true,
	})

	return data
}
