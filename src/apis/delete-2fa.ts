import {SimpleDetailResponse} from "~/server-types"
import {client} from "~/constants/axios-client"

export interface Delete2FAData {
	code?: string
	recoveryCode?: string
}

export default async function delete2FA({
	recoveryCode,
	code,
}: Delete2FAData): Promise<SimpleDetailResponse> {
	const {data} = await client.delete(`${import.meta.env.VITE_SERVER_BASE_URL}/v1/setup-otp`, {
		withCredentials: true,
		data: {
			code,
			recoveryCode,
		},
	})

	return data
}
