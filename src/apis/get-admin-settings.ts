import {client} from "~/constants/axios-client"
import {AdminSettings} from "~/server-types"

export default async function getAdminSettings(): Promise<Partial<AdminSettings>> {
	const {data} = await client.get(`${import.meta.env.VITE_SERVER_BASE_URL}/v1/admin/settings`, {
		withCredentials: true,
	})

	return data
}
