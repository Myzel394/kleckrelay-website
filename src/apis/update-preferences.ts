import {ImageProxyFormatType, ProxyUserAgentType, SimpleDetailResponse} from "~/server-types"
import {client} from "~/constants/axios-client"

export interface UpdatePreferencesData {
	aliasRemoveTrackers?: boolean
	aliasCreateMailReport?: boolean
	aliasProxyImages?: boolean
	aliasImageProxyFormat?: ImageProxyFormatType
	aliasProxyUserAgent?: ProxyUserAgentType
	aliasExpandUrlShorteners?: boolean
	aliasRejectOnPrivacyLeak?: boolean
}

export default async function updatePreferences(
	updateData: UpdatePreferencesData,
): Promise<SimpleDetailResponse> {
	const {data} = await client.patch(
		`${import.meta.env.VITE_SERVER_BASE_URL}/v1/preferences`,
		updateData,
		{
			withCredentials: true,
		},
	)

	return data
}
