interface ExtensionKleckMessagePasswordAvailable {
	type: "password-available"
	data: {
		isAvailable: boolean
	}
}

interface ExtensionKleckMessageAskForPassword {
	type: "ask-for-password"
}

export type ExtensionKleckMessage =
	| ExtensionKleckMessagePasswordAvailable
	| ExtensionKleckMessageAskForPassword

export type ExtensionKleckEvent = MessageEvent & {
	detail: ExtensionKleckMessage
}
