export enum ImageProxyFormatType {
	WEBP = "webp",
	PNG = "png",
	JPEG = "jpeg",
}

export enum ProxyUserAgentType {
	APPLE_MAIL = "apple-mail",
	GOOGLE_MAIL = "google-mail",
	OUTLOOK_WINDOWS = "outlook-windows",
	OUTLOOK_MACOS = "outlook-macos",
	FIREFOX = "firefox",
	CHROME = "chrome",
}

export enum AliasType {
	RANDOM = "random",
	CUSTOM = "custom",
}

export enum Language {
	EN_US = "en_US",
}

export interface User {
	id: string
	createdAt: Date
	email: {
		address: string
		isVerified: boolean
	}
	preferences: {
		aliasRemoveTrackers: boolean
		aliasCreateMailReport: boolean
		aliasProxyImages: boolean
		aliasImageProxyFormat: ImageProxyFormatType
		aliasImageProxyUserAgent: ProxyUserAgentType
	}
}

export interface AuthenticationDetails {
	user: User
	detail: string
}

export interface ServerSettings {
	mail_domain: string
	random_email_id_min_length: number
	random_email_id_chars: string
	image_proxy_enabled: boolean
	image_proxy_life_time: number
	disposable_emails_enabled: boolean
	other_relays_enabled: boolean
	other_relay_domains: Array<string>
	email_verification_chars: string
	email_verification_length: number
}

export interface MinimumServerResponse {
	detail?: string
}

export interface Alias {
	id: string
	domain: string
	local: string
	isActive: boolean
	encryptedNotes: string
	removeTrackers: boolean
	createMailReport: boolean
	proxyImages: boolean
	imageProxyFormat: ImageProxyFormatType
	imageProxyUserAgent: ProxyUserAgentType
}
