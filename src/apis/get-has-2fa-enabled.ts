import {client} from "~/constants/axios-client"

export default async function getHas2FAEnabled(): Promise<boolean> {
	const {data} = await client.get(`${import.meta.env.VITE_SERVER_BASE_URL}/v1/setup-otp/`, {
		withCredentials: true,
	})

	return data.enabled
}
