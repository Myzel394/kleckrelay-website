import {SimpleDetailResponse} from "~/server-types"
import {client} from "~/constants/axios-client"

export default async function deleteReport(id: string): Promise<SimpleDetailResponse> {
	const {data} = await client.delete(`${import.meta.env.VITE_SERVER_BASE_URL}/v1/report/${id}`, {
		withCredentials: true,
	})

	return data
}
