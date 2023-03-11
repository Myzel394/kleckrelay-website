import {APIKey, GetPageData, PaginationResult} from "~/server-types"
import {client} from "~/constants/axios-client"
import parseAPIKey from "~/apis/helpers/parse-api-key"

export interface GetAPIKeysData extends GetPageData {}

export default async function getAPIKeys({size, page}: GetAPIKeysData = {}): Promise<
	PaginationResult<APIKey>
> {
	const {data} = await client.get(`${import.meta.env.VITE_SERVER_BASE_URL}/v1/api-key/`, {
		withCredentials: true,
		params: {
			size,
			page,
		},
	})

	return {
		...data,
		items: data.items.map(parseAPIKey),
	}
}
