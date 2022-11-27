interface ExtensionKleckMessagePasswordStatus {
	type: "password-status"
}

interface ExtensionKleckMessageAskForPassword {
	type: "ask-for-password"
}

interface ExtensionKleckMessageUser {
	type: "get-user"
}

export type ExtensionKleckMessage =
	| ExtensionKleckMessagePasswordStatus
	| ExtensionKleckMessageAskForPassword
	| ExtensionKleckMessageUser

export type ExtensionKleckEvent = MessageEvent & {
	detail: ExtensionKleckMessage
}
