import axios from "axios"

import {User} from "~/server-types"

export interface RefreshTokenResult {
	user: User
	detail: string
}

export const REFRESH_TOKEN_URL = `${
	import.meta.env.VITE_SERVER_BASE_URL
}/api/refresh-token`

export default async function refreshToken(): Promise<RefreshTokenResult> {
	const {data} = await axios.post(REFRESH_TOKEN_URL)

	return data
}
