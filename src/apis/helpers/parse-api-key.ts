import {APIKey} from "~/server-types"

export default function parseAPIKey(key: APIKey): APIKey {
	return {
		...key,
		expiresAt: new Date(key.expiresAt),
	}
}
