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

export enum Theme {
	LIGHT = "light",
	DARK = "dark",
}

export enum ThemeSettings {
	LIGHT = "light",
	DARK = "dark",
	SYSTEM = "system",
}

export interface ServerUser {
	id: string
	createdAt: Date
	encryptedNotes: string
	isDecrypted: false
	encryptedPassword: string
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

export interface SimpleDetailResponse {
	detail: string
}

export interface AuthenticationDetails extends SimpleDetailResponse {
	user: ServerUser
}

export interface ServerSettings {
	mailDomain: string
	randomEmailIdMinLength: number
	RandomEmailIdChars: string
	imageProxyEnabled: boolean
	imageProxyLifeTime: number
	disposableEmailsEnabled: boolean
	otherRelaysEnabled: boolean
	otherRelayDomains: Array<string>
	emailVerificationChars: string
	emailVerificationLength: number
	emailLoginTokenChars: string
	emailLoginTokenLength: number
	emailResendWaitTime: number
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

export interface Report {
	id: string
	encryptedNotes: string
}

export interface UserNote {
	theme: Theme
	privateKey: string
}

export interface User
	extends Omit<ServerUser, "encryptedNotes" | "isDecrypted"> {
	notes: UserNote
	isDecrypted: true
}
