interface ExtensionKleckMessagePasswordStatus {
	type: "password-status"
}

interface ExtensionKleckMessageAskForPassword {
	type: "ask-for-password"
}

interface ExtensionKleckMessageUser {
	type: "get-user"
}

interface ExtensionKleckMessageEnterPassword {
	type: "enter-password"
}

interface ExtensionKleckMessageRefetchAliases {
	type: "refetch-aliases"
}

export type ExtensionKleckMessage =
	| ExtensionKleckMessagePasswordStatus
	| ExtensionKleckMessageAskForPassword
	| ExtensionKleckMessageUser
	| ExtensionKleckMessageEnterPassword
	| ExtensionKleckMessageRefetchAliases

export type ExtensionKleckEvent = MessageEvent & {
	detail: ExtensionKleckMessage
}
