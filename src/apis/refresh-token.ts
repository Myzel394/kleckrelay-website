import {ServerUser} from "~/server-types"
import {client} from "~/constants/axios-client"

export const REFRESH_TOKEN_URL = `${import.meta.env.VITE_SERVER_BASE_URL}/v1/auth/refresh`

export default async function refreshToken(): Promise<ServerUser> {
	const {data} = await client.post(
		REFRESH_TOKEN_URL,
		{},
		{
			withCredentials: true,
		},
	)

	return data
}
