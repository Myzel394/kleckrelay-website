import {Alias, PaginationResult} from "~/server-types"
import {client} from "~/constants/axios-client"

export default async function getAliases(): Promise<PaginationResult<Alias>> {
	const {data} = await client.get(
		`${import.meta.env.VITE_SERVER_BASE_URL}/alias`,
		{
			withCredentials: true,
		},
	)

	return data
}
