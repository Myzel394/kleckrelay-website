import {User} from "~/server-types"
import {client} from "~/constants/axios-client"

export interface RefreshTokenResult {
	user: User
	detail: string
}

export const REFRESH_TOKEN_URL = `${
	import.meta.env.VITE_SERVER_BASE_URL
}/api/refresh-token`

export default async function refreshToken(): Promise<RefreshTokenResult> {
	const {data} = await client.post(REFRESH_TOKEN_URL)

	return data
}
