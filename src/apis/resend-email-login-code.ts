import {SimpleDetailResponse} from "~/server-types"
import {client} from "~/constants/axios-client"

export interface ResendEmailLoginCodeData {
	email: string
	sameRequestToken: string
}

export default async function resendEmailLoginCode({
	email,
	sameRequestToken,
}: ResendEmailLoginCodeData): Promise<SimpleDetailResponse> {
	const {data} = await client.post(
		`${
			import.meta.env.VITE_SERVER_BASE_URL
		}/auth/login/email-token/resend-email`,
		{
			email,
			sameRequestToken,
		},
	)

	return data
}
