import {User} from "~/server-types"

export default function parseUser(user: any): User {
	return {
		...user,
		createdAt: new Date(user.createdAt),
	}
}
