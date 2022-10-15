import {User} from "~/server-types"

export default function parseUser(user: any): User {
	return {
		id: user.id,
		createdAt: new Date(user.created_at),
		email: {
			address: user.email.address,
			isVerified: user.email.is_verified,
		},
		preferences: {
			aliasRemoveTrackers: user.preferences.alias_remove_trackers,
			aliasCreateMailReport: user.preferences.alias_create_mail_report,
			aliasProxyImages: user.preferences.alias_proxy_images,
			aliasImageProxyFormat: user.preferences.alias_image_proxy_format,
			aliasImageProxyUserAgent:
				user.preferences.alias_image_proxy_user_agent,
		},
	}
}
