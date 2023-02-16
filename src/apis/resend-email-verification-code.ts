import {SimpleDetailResponse} from "~/server-types"
import {client} from "~/constants/axios-client"

export type ResendEmailVerificationCodeResponse =
	| SimpleDetailResponse & {
			detail: string
			code: "ok:email_already_verified"
	  }

export default async function resendEmailVerificationCode(
	email: string,
): Promise<ResendEmailVerificationCodeResponse> {
	const {data} = await client.post(
		`${import.meta.env.VITE_SERVER_BASE_URL}/v1/auth/resend-email`,
		{
			email,
		},
	)

	return data
}
