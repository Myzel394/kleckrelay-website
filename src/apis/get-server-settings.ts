import {ServerSettings} from "~/server-types"
import {client} from "~/constants/axios-client"

export default async function getServerSettings(): Promise<ServerSettings> {
	return (
		await client.get(`${import.meta.env.VITE_SERVER_BASE_URL}/settings`)
	).data
}
