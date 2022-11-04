import {AuthenticationDetails} from "~/server-types"
import {client} from "~/constants/axios-client"
import parseUser from "~/apis/helpers/parse-user"

export interface VerifyLoginWithEmailData {
	email: string
	token: string
	sameRequestToken?: string
}

export default async function verifyLoginWithEmail({
	email,
	token,
	sameRequestToken,
}: VerifyLoginWithEmailData): Promise<AuthenticationDetails> {
	const {data} = await client.post(
		`${import.meta.env.VITE_SERVER_BASE_URL}/auth/login/email-token/verify`,
		{
			email,
			token,
			sameRequestToken,
		},
		{
			withCredentials: true,
		},
	)

	return {
		...data,
		user: parseUser(data.user),
	}
}
