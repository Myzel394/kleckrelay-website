import {ServerUser} from "~/server-types"
import {client} from "~/constants/axios-client"
import parseUser from "~/apis/helpers/parse-user"

export interface VerifyLoginWithEmailData {
	email: string
	token: string
	sameRequestToken?: string
}

export type VerifyLoginWithEmailResponse = ServerUser & {
	corsToken?: string
}

export default async function verifyLoginWithEmail({
	email,
	token,
	sameRequestToken,
}: VerifyLoginWithEmailData): Promise<VerifyLoginWithEmailResponse> {
	const {data} = await client.post(
		`${import.meta.env.VITE_SERVER_BASE_URL}/v1/auth/login/email-token/verify`,
		{
			email,
			token,
			sameRequestToken,
		},
		{
			withCredentials: true,
		},
	)

	if (data.corsToken) {
		return data
	}

	return parseUser(data)
}
