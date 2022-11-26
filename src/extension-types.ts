interface ExtensionKleckMessagePasswordAvailable {
	type: "password-available"
}

interface ExtensionKleckMessageAskForPassword {
	type: "ask-for-password"
}

interface ExtensionKleckMessageUser {
	type: "get-user"
}

export type ExtensionKleckMessage =
	| ExtensionKleckMessagePasswordAvailable
	| ExtensionKleckMessageAskForPassword
	| ExtensionKleckMessageUser

export type ExtensionKleckEvent = MessageEvent & {
	detail: ExtensionKleckMessage
}
