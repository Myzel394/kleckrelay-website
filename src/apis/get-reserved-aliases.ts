import {GetPageData, PaginationResult, ReservedAlias} from "~/server-types"
import {client} from "~/constants/axios-client"

export interface GetReservedAliasesData extends GetPageData {
	query?: string
}

export default async function getReservedAliases({
	query,
	size,
	page,
}: GetReservedAliasesData = {}): Promise<PaginationResult<ReservedAlias>> {
	const {data} = await client.get(`${import.meta.env.VITE_SERVER_BASE_URL}/v1/reserved-alias/`, {
		withCredentials: true,
		params: {
			query,
			size,
			page,
		},
	})

	return data
}
