import {client} from "~/constants/axios-client"

export interface LoginWithEmailResult {
	detail: string
	sameRequestToken: string
}

export default async function loginWithEmail(email: string): Promise<LoginWithEmailResult> {
	const {data} = await client.post(
		`${import.meta.env.VITE_SERVER_BASE_URL}/v1/auth/login/email-token`,
		{
			email,
		},
	)

	return data
}
