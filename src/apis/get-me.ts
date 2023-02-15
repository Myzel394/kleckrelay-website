import {ServerUser} from "~/server-types"
import {client} from "~/constants/axios-client"

export default async function getMe(): Promise<ServerUser> {
	const {data} = await client.get(`${import.meta.env.VITE_SERVER_BASE_URL}/v1/account/me`, {
		withCredentials: true,
	})

	return data
}
