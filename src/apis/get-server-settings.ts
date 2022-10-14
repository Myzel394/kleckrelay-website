import axios from "axios"

import {ServerSettings} from "~/types"

export default async function getServerSettings(): Promise<ServerSettings> {
	return (
		await axios.get(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/settings`)
	).data
}
