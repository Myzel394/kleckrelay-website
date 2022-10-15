import axios from "axios"

import {User} from "~/server-types"

export interface RefreshTokenResult {
	user: User
	detail: string
}

export default async function refreshToken(): Promise<RefreshTokenResult> {
	const {data} = await axios.post(
		`${import.meta.env.VITE_SERVER_BASE_URL}/api/refresh-token`,
	)

	return data
}
