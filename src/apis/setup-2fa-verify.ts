import {client} from "~/constants/axios-client"

export interface Verify2FASetupData {
	code: string
}

export default async function verify2FASetup({code}: Verify2FASetupData): Promise<void> {
	const {data} = await client.post(
		`${import.meta.env.VITE_SERVER_BASE_URL}/v1/setup-otp/verify`,
		{
			code,
		},
		{
			withCredentials: true,
		},
	)

	return data
}
