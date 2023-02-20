import {ServerSettings} from "~/server-types"
import {client} from "~/constants/axios-client"

export default async function getServerSettings(): Promise<ServerSettings> {
	const savedData = sessionStorage.getItem("server-settings")

	if (savedData) {
		return JSON.parse(savedData)
	}

	const {data} = await client.get(`${import.meta.env.VITE_SERVER_BASE_URL}/v1/server/settings`)

	sessionStorage.setItem("server-settings", JSON.stringify(data))

	return data
}
