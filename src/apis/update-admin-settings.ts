import {client} from "~/constants/axios-client"
import {AdminSettings} from "~/server-types"

export type UpdateAdminSettingsResponse =
	| Partial<AdminSettings>
	| {
			detail: string
			code: "error:settings:global_settings_disabled"
	  }

export default async function updateAdminSettings(
	settings: Partial<AdminSettings>,
): Promise<AdminSettings> {
	const {data} = await client.patch(
		`${import.meta.env.VITE_SERVER_BASE_URL}/v1/admin/settings`,
		settings,
		{
			withCredentials: true,
		},
	)

	return data
}
