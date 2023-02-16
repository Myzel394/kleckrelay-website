import {SimpleDetailResponse} from "~/server-types"
import {client} from "~/constants/axios-client"

export interface ResendEmailLoginCodeData {
	email: string
	sameRequestToken: string
}

export type ResendEmailLoginCodeResponse =
	| SimpleDetailResponse
	| {
			detail: string
			code: "ok:email_already_verified"
	  }

export default async function resendEmailLoginCode({
	email,
	sameRequestToken,
}: ResendEmailLoginCodeData): Promise<SimpleDetailResponse> {
	const {data} = await client.post(
		`${import.meta.env.VITE_SERVER_BASE_URL}/v1/auth/login/email-token/resend-email`,
		{
			email,
			sameRequestToken,
		},
	)

	return data
}
