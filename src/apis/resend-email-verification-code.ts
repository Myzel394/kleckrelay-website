import axios from "axios"

import {MinimumServerResponse} from "~/server-types"

export default async function resendEmailVerificationCode(
	email: string,
): Promise<MinimumServerResponse> {
	const {data} = await axios.post(
		`${import.meta.env.VITE_SERVER_BASE_URL}/auth/resend-email`,
		{
			email,
		},
	)

	return data
}
