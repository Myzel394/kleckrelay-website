import {client} from "~/constants/axios-client"
import {Alias} from "~/server-types"

export default async function getAlias(address: string): Promise<Alias> {
	const {data} = await client.get(
		`${import.meta.env.VITE_SERVER_BASE_URL}/alias/${address}`,
		{
			withCredentials: true,
		},
	)

	return data
}
