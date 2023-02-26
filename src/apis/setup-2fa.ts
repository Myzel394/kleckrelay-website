import {client} from "~/constants/axios-client"

export interface Setup2FAResponse {
	secret: string
	recoveryCodes: string[]
}

export default async function setup2FA(): Promise<Setup2FAResponse> {
	const {data} = await client.post(
		`${import.meta.env.VITE_SERVER_BASE_URL}/v1/setup-otp/`,
		{},
		{
			withCredentials: true,
		},
	)

	return data
}
