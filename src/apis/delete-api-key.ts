import {client} from "~/constants/axios-client"

export default async function deleteApiKey(id: string): Promise<void> {
	const {data} = await client.delete(`${import.meta.env.VITE_SERVER_BASE_URL}/v1/api-key/${id}`, {
		withCredentials: true,
	})

	return data
}
