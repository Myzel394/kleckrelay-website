import {client} from "~/constants/axios-client"

export interface FindPublicKeyResponse {
	publicKey: string
	type: string
	createdAt: Date
}

export default async function findPublicKey(): Promise<FindPublicKeyResponse> {
	const {data} = await client.post(
		`${import.meta.env.VITE_SERVER_BASE_URL}/v1/preferences/find-public-key`,
		{},
		{
			withCredentials: true,
		},
	)

	return data
}
