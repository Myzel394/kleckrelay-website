import {MinimumServerResponse} from "~/server-types"
import {client} from "~/constants/axios-client"

export default async function logout(): Promise<MinimumServerResponse> {
	const {data} = await client.post(
		`${import.meta.env.VITE_SERVER_BASE_URL}/auth/logout`,
	)

	return data
}
