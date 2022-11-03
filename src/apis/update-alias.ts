import {Alias, ImageProxyFormatType, ImageProxyUserAgentType} from "~/server-types"
import {client} from "~/constants/axios-client"

export interface UpdateAliasData {
	isActive?: boolean
	encryptedNotes?: string
	prefRemoveTrackers?: boolean | null
	prefCreateMailReport?: boolean | null
	prefProxyImages?: boolean | null
	prefImagProxyFormat?: ImageProxyFormatType | null
	prefImageProxyUserAgent?: ImageProxyUserAgentType | null
}

export default async function updateAlias(id: string, updateData: UpdateAliasData): Promise<Alias> {
	const {data} = await client.patch(
		`${import.meta.env.VITE_SERVER_BASE_URL}/alias/${id}`,
		updateData,
		{
			withCredentials: true,
		},
	)

	return data
}
