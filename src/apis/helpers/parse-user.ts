import {ServerUser} from "~/server-types"

export default function parseUser(user: any): ServerUser {
	return {
		...user,
		isDecrypted: false,
		createdAt: new Date(user.createdAt),
	}
}
