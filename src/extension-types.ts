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

export type ExtensionKleckMessage =
	| ExtensionKleckMessagePasswordStatus
	| ExtensionKleckMessageAskForPassword
	| ExtensionKleckMessageUser
	| ExtensionKleckMessageEnterPassword

export type ExtensionKleckEvent = MessageEvent & {
	detail: ExtensionKleckMessage
}
