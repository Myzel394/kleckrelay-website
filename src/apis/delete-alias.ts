import {client} from "~/constants/axios-client"
import {SimpleDetailResponse} from "~/server-types"

export default async function deleteAlias(id: string): Promise<SimpleDetailResponse> {
	const {data} = await client.delete(`${import.meta.env.VITE_SERVER_BASE_URL}/v1/alias/${id}`, {
		withCredentials: true,
	})

	return data
}
