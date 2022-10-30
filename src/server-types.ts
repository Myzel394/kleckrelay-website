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
	otherRelayDomains: string[]
	emailVerificationChars: string
	emailVerificationLength: number
	emailLoginTokenChars: string
	emailLoginTokenLength: number
	emailResendWaitTime: number
	customAliasSuffixLength: number
}

export interface Alias {
	id: string
	domain: string
	local: string
	isActive: boolean
	encryptedNotes: string
	type: AliasType

	prefRemoveTrackers: boolean | null
	prefCreateMailReport: boolean | null
	prefProxyImages: boolean | null
	prefImageProxyFormat: ImageProxyFormatType | null
	prefImageProxyUserAgent: ProxyUserAgentType | null
}

export interface AliasNote {
	version: "1.0"
	data: {
		createdAt: Date | null
		personalNotes: string
		websites: Array<{
			url: string
		}>
	}
}

export interface DecryptedAlias extends Omit<Alias, "encryptedNotes"> {
	notes: AliasNote
}

export interface AliasList {
	id: string
	domain: string
	local: string
	isActive: boolean
	type: AliasType
}

export interface Report {
	id: string
	encryptedContent: string
}

export interface DecryptedReportContent {
	version: "1.0"
	id: string
	messageDetails: {
		meta: {
			messageId: string
			from: string
			to: string
			createdAt: Date
		}
		content: {
			subject: string
			proxiedImages: Array<{
				url: string
				imageProxyId: string
				createdAt: Date
				serverUrl: string
			}>
			singlePixelImages: Array<{
				source: string
				trackerName: string
				trackerUrl: string
			}>
		}
	}
}

export type PaginationResult<T> = {
	items: T[]
	total: number
	page: number
	size: number
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

export interface GetPageData {
	page?: number
	size?: number
}
