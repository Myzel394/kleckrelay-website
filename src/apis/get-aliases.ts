import {AliasList, AliasType, GetPageData, PaginationResult} from "~/server-types"
import {client} from "~/constants/axios-client"

export interface GetAliasesData extends GetPageData {
	query?: string
	active?: boolean
	type?: AliasType
}

export default async function getAliases({
	query,
	size,
	page,
	active,
	type,
}: GetAliasesData): Promise<PaginationResult<AliasList>> {
	const {data} = await client.get(`${import.meta.env.VITE_SERVER_BASE_URL}/v1/alias`, {
		withCredentials: true,
		params: {
			query,
			size,
			page,
			active,
			aliasType: type,
		},
	})

	return data
}
