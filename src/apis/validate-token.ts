import {AuthenticationDetails} from "~/types"
import axios from "axios"

export interface ValidateTokenData {
	email: string
	token: string
}

export default async function validateToken({
	email,
	token,
}: ValidateTokenData): Promise<AuthenticationDetails> {
	const {data} = await axios.post(
		`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/auth/verify-email`,
		{
			email: email,
			token: token,
		},
	)

	return data
}
