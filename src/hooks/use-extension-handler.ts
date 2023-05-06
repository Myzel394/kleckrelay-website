import {useCallback} from "react"

import {useEventListener} from "@react-hookz/web"

import {ExtensionKleckEvent, ExtensionKleckMessageLatestAlias} from "~/extension-types"

export interface UseExtensionHandlerData {
	onEnterPassword?: () => void
	onRefetchAliases?: () => void
	onLatestAliasChange?: ({latestAlias}: ExtensionKleckMessageLatestAlias["data"]) => void
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

	useEventListener(window, "kleckrelay-kleck", handleExtensionEvent, {
		passive: true,
	})
}
