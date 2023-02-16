import {ServerSettings} from "~/server-types"
import {client} from "~/constants/axios-client"

export type GetServerSettingsResponse =
	| ServerSettings
	| {
			detail: string
			code: "error:settings:statistics_disabled"
	  }

export default async function getServerSettings(): Promise<GetServerSettingsResponse> {
	return (await client.get(`${import.meta.env.VITE_SERVER_BASE_URL}/v1/server/settings`)).data
}
