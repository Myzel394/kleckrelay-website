import {useCallback} from "react"
import {useEvent} from "react-use"

import {ExtensionKleckEvent} from "~/extension-types"

export interface UseExtensionHandlerData {
	onEnterPassword?: () => void
}

export default function useExtensionHandler({onEnterPassword}: UseExtensionHandlerData): void {
	const handleExtensionEvent = useCallback(
		(event: ExtensionKleckEvent) => {
			switch (event.detail.type) {
				case "enter-password":
					onEnterPassword?.()
					break
			}
		},
		[onEnterPassword],
	)

	useEvent("kleckrelay-kleck", handleExtensionEvent)
}
