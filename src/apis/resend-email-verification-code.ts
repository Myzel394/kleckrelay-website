import axios from "axios"

export default function resendEmailVerificationCode(
	email: string,
): Promise<void> {
	return axios.post(
		`${import.meta.env.VITE_SERVER_BASE_URL}/auth/resend-email`,
		{
			email,
		},
	)
}
