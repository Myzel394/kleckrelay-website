import {useCallback, useState} from "react"
import {useEventListener} from "@react-hookz/web"

export default function useWindowVisible(isVisibleByDefault = true): boolean {
	const [isVisible, setIsVisible] = useState<boolean>(isVisibleByDefault)

	const handleVisibilityChange = useCallback(() => {
		setIsVisible(document.visibilityState === "visible")
	}, [])

	useEventListener(document, "visibilitychange", handleVisibilityChange)

	return isVisible
}
