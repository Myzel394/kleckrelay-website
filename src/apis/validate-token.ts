import axios from "axios"

import {AuthenticationDetails} from "~/types"

export interface ValidateTokenData {
	email: string
	token: string
}

export default async function validateToken({
	email,
	token,
}: ValidateTokenData): Promise<AuthenticationDetails> {
	const {data} = await axios.post(
		`${import.meta.env.VITE_SERVER_BASE_URL}/auth/verify-email`,
		{
			email: email,
			token: token,
		},
	)

	return data
}
