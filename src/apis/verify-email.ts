import {ServerUser} from "~/server-types"
import {client} from "~/constants/axios-client"
import parseUser from "~/apis/helpers/parse-user"

export interface VerifyEmailData {
	email: string
	token: string
}

export default async function verifyEmail({email, token}: VerifyEmailData): Promise<ServerUser> {
	const {data} = await client.post(
		`${import.meta.env.VITE_SERVER_BASE_URL}/v1/auth/verify-email`,
		{
			email: email,
			token: token,
		},
		{
			withCredentials: true,
		},
	)

	return parseUser(data.user)
}
