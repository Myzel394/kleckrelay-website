import {SimpleDetailResponse} from "~/server-types"
import {client} from "~/constants/axios-client"

export interface ChangeAllowEmailLoginFromDifferentDevicesData {
	email: string
	sameRequestToken: string
	allow: boolean
}

export default async function changeAllowEmailLoginFromDifferentDevices({
	email,
	sameRequestToken,
	allow,
}: ChangeAllowEmailLoginFromDifferentDevicesData): Promise<SimpleDetailResponse> {
	const {data} = await client.patch(
		`${
			import.meta.env.VITE_SERVER_BASE_URL
		}/auth/login/email-token/allow-login-from-different-devices`,
		{
			email,
			sameRequestToken,
			allow,
		},
	)

	return data
}
