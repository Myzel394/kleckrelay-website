import {client} from "~/constants/axios-client"

export interface GetAdminUsersResponse {
	users: Array<{
		id: string
		email: {
			id: string
			address: string
		}
	}>
}

export default async function getAdminUsers(): Promise<GetAdminUsersResponse> {
	const {data} = await client.get(`${import.meta.env.VITE_SERVER_BASE_URL}/v1/admin/users`, {
		withCredentials: true,
	})

	return data
}
