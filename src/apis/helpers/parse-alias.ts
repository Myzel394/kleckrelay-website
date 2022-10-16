import {Alias} from "~/server-types"

export default function parseAlias(alias: any): Alias {
	return {
		id: alias.id,
		domain: alias.domain,
		local: alias.local,
		isActive: alias.is_active,
		encryptedNotes: alias.encrypted_notes,
		removeTrackers: alias.remove_trackers,
		createMailReport: alias.create_mail_report,
		proxyImages: alias.proxy_images,
		imageProxyFormat: alias.image_proxy_format,
		imageProxyUserAgent: alias.image_proxy_user_agent,
	}
}
