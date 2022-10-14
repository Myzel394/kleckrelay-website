import axios from "axios"

import {ServerSettings} from "~/types"

export default async function getServerSettings(): Promise<ServerSettings> {
	return (await axios.get(`${import.meta.env.VITE_SERVER_BASE_URL}/settings`))
		.data
}
