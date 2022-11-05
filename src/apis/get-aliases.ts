import {AliasList, GetPageData, PaginationResult} from "~/server-types"
import {client} from "~/constants/axios-client"

export interface GetAliasesData extends GetPageData {
	query?: string
}

export default async function getAliases({
	query,
	size,
	page,
}: GetAliasesData): Promise<PaginationResult<AliasList>> {
	const {data} = await client.get(`${import.meta.env.VITE_SERVER_BASE_URL}/v1/alias`, {
		withCredentials: true,
		params: {
			query,
			size,
			page,
		},
	})

	return data
}
