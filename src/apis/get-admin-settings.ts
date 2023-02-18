import {client} from "~/constants/axios-client"
import {AdminSettings} from "~/server-types"

export type GetAdminSettingsResponse =
	| Partial<AdminSettings> & {
			detail: string
			code: "error:settings:global_settings_disabled"
	  }

export default async function getAdminSettings(): Promise<GetAdminSettingsResponse> {
	const {data} = await client.get(`${import.meta.env.VITE_SERVER_BASE_URL}/v1/admin/settings`, {
		withCredentials: true,
	})

	return data
}
