import {SimpleDetailResponse} from "~/server-types"
import {client} from "~/constants/axios-client"

export default async function resendEmailVerificationCode(
	email: string,
): Promise<SimpleDetailResponse> {
	const {data} = await client.post(
		`${import.meta.env.VITE_SERVER_BASE_URL}/v1/auth/resend-email`,
		{
			email,
		},
	)

	return data
}
