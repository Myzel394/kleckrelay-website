import {client} from "~/constants/axios-client"
import {Alias} from "~/server-types"

export default async function getAlias(aliasID: string): Promise<Alias> {
	const {data} = await client.get(`${import.meta.env.VITE_SERVER_BASE_URL}/v1/alias/${aliasID}`, {
		withCredentials: true,
	})

	return data
}
