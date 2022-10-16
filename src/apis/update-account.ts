import {Language} from "~/server-types"
import {client} from "~/constants/axios-client"
import parseUser from "~/apis/helpers/parse-user"

export interface UpdateAccountData {
	password: string
	publicKey: string
	encryptedPrivateKey: string
	language: Language
}

export default async function updateAccount(
	updateData: Partial<UpdateAccountData>,
): Promise<void> {
	const {data} = await client.patch(
		`${import.meta.env.VITE_SERVER_BASE_URL}/account`,
		updateData,
	)

	return {
		...data,
		user: parseUser(data.user),
	}
}
