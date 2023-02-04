import {ReservedAlias} from "~/server-types"
import {client} from "~/constants/axios-client"

export default async function getReservedAlias(id: string): Promise<ReservedAlias> {
	const {data} = await client.get(
		`${import.meta.env.VITE_SERVER_BASE_URL}/v1/reserved-alias/${id}`,
		{
			withCredentials: true,
		},
	)

	return data
}
