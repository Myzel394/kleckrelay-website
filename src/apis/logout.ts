import {client} from "~/constants/axios-client"
import {SimpleDetailResponse} from "~/server-types"

export default async function logout(): Promise<SimpleDetailResponse> {
	const {data} = await client.post(`${import.meta.env.VITE_SERVER_BASE_URL}/v1/auth/logout`)

	return data
}
