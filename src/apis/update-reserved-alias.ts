import {ReservedAlias} from "~/server-types"
import {client} from "~/constants/axios-client"

export interface UpdateReservedAliasData {
	isActive?: boolean
	users?: Array<{
		id: string
	}>
}

export default async function updateReservedAlias(
	id: string,
	{isActive, users}: UpdateReservedAliasData,
): Promise<ReservedAlias> {
	const {data} = await client.patch(
		`${import.meta.env.VITE_SERVER_BASE_URL}/v1/reserved-alias/${id}`,
		{
			isActive,
			users,
		},
		{
			withCredentials: true,
		},
	)

	return data
}
