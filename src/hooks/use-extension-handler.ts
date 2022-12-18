import {useCallback} from "react"
import {useEvent} from "react-use"

import {ExtensionKleckEvent, ExtensionKleckMessageLatestAlias} from "~/extension-types"

export interface UseExtensionHandlerData {
	onEnterPassword?: () => void
	onRefetchAliases?: () => void
	onLatestAliasChange?: ({latestAliasId}: ExtensionKleckMessageLatestAlias["data"]) => void
}

export default function useExtensionHandler({
	onEnterPassword,
	onRefetchAliases,
	onLatestAliasChange,
}: UseExtensionHandlerData): void {
	const handleExtensionEvent = useCallback(
		(event: ExtensionKleckEvent) => {
			switch (event.detail.type) {
				case "enter-password":
					onEnterPassword?.()
					break
				case "refetch-aliases":
					onRefetchAliases?.()
					break
				case "latest-alias":
					onLatestAliasChange?.(event.detail.data)
			}
		},
		[onEnterPassword, onRefetchAliases, onLatestAliasChange],
	)

	useEvent("kleckrelay-kleck", handleExtensionEvent)
}
