import axios from "axios"

import {MinimumServerResponse} from "~/server-types"

export default async function logout(): Promise<MinimumServerResponse> {
	const {data} = await axios.post(
		`${import.meta.env.VITE_SERVER_BASE_URL}/auth/logout`,
	)

	return data
}
