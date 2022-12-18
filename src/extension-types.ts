export interface ExtensionKleckMessagePasswordStatus {
	type: "password-status"
}

export interface ExtensionKleckMessageAskForPassword {
	type: "ask-for-password"
}

export interface ExtensionKleckMessageUser {
	type: "get-user"
}

export interface ExtensionKleckMessageEnterPassword {
	type: "enter-password"
}

export interface ExtensionKleckMessageRefetchAliases {
	type: "refetch-aliases"
}

export interface ExtensionKleckMessageLatestAlias {
	type: "latest-alias"
	data: {
		latestAliasId: string
	}
}

export type ExtensionKleckMessage =
	| ExtensionKleckMessagePasswordStatus
	| ExtensionKleckMessageAskForPassword
	| ExtensionKleckMessageUser
	| ExtensionKleckMessageEnterPassword
	| ExtensionKleckMessageRefetchAliases
	| ExtensionKleckMessageLatestAlias

export type ExtensionKleckEvent = MessageEvent & {
	detail: ExtensionKleckMessage
}
