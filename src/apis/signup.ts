import axios from "axios"

export interface SignupResult {
	normalized_email: string
}

export default async function signup(email: string): Promise<SignupResult> {
	const {data} = await axios.post(
		`${import.meta.env.VITE_SERVER_BASE_URL}/auth/signup`,
		{
			email,
		},
	)

	return data
}
