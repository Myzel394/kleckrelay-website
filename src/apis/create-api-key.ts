import {APIKey} from "~/server-types"
import {client} from "~/constants/axios-client"
import formatISO from "date-fns/formatISO"
import parseAPIKey from "~/apis/helpers/parse-api-key"

export interface CreateAPIKeyData {
	label: string
	scopes: APIKey["scopes"]

	expiresAt?: Date
}

export default async function createAPIKey({
	label,
	scopes,
	expiresAt,
}: CreateAPIKeyData): Promise<APIKey & {key: string}> {
	const {data} = await client.post(
		`${import.meta.env.VITE_SERVER_BASE_URL}/v1/api-key`,
		{
			label,
			scopes,
			expiresAt: expiresAt
				? formatISO(expiresAt, {
						representation: "date",
				  })
				: undefined,
		},
		{
			withCredentials: true,
		},
	)

	return parseAPIKey(data) as APIKey & {key: string}
}
