import {ServerSettings, ServerUser, User} from "~/server-types"

export default function getUserSalt(
	user: ServerUser | User,
	serverSettings: ServerSettings,
): string {
	return `${user.salt}:${serverSettings.instanceSalt}`
}
