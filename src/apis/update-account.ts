import {Language, ServerUser} from "~/server-types"
import {client} from "~/constants/axios-client"
import parseUser from "~/apis/helpers/parse-user"

export interface UpdateAccountData {
	encryptedPassword?: string
	encryptedNotes?: string
	publicKey?: string
	language?: Language
}

export default async function updateAccount(updateData: UpdateAccountData): Promise<ServerUser> {
	const {data} = await client.patch(
		`${import.meta.env.VITE_SERVER_BASE_URL}/v1/account`,
		updateData,
		{
			withCredentials: true,
		},
	)

	return parseUser(data.user)
}
