import {ServerUser} from "~/server-types"
import {client} from "~/constants/axios-client"
import parseUser from "./helpers/parse-user"

export interface VerifyOTPData {
	code: string
	corsToken: string
}

export default async function verifyOTP({code, corsToken}: VerifyOTPData): Promise<ServerUser> {
	const {data} = await client.post(
		`${import.meta.env.VITE_SERVER_BASE_URL}/v1/auth/login/verify-otp`,
		{
			code,
			corsToken,
		},
		{
			withCredentials: true,
		},
	)

	return parseUser(data)
}
