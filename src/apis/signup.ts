import {client} from "~/constants/axios-client"

export interface SignupResult {
	normalizedEmail: string
}

export default async function signup(email: string): Promise<SignupResult> {
	const {data} = await client.post(`${import.meta.env.VITE_SERVER_BASE_URL}/v1/auth/signup`, {
		email,
	})

	return data
}
