import {ReservedAlias} from "~/server-types"
import {client} from "~/constants/axios-client"

export interface CreateReservedAliasData {
	local: string
	users: Array<{
		id: string
	}>

	isActive?: boolean
}

export default async function createReservedAlias(
	aliasData: CreateReservedAliasData,
): Promise<ReservedAlias> {
	const {data} = await client.post(
		`${import.meta.env.VITE_SERVER_BASE_URL}/v1/reserved-alias`,
		aliasData,
		{
			withCredentials: true,
		},
	)

	return data
}
