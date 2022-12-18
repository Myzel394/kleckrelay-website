import {useCallback, useState} from "react"
import {useEvent} from "react-use"

export default function useWindowVisible(isVisibleByDefault = true): boolean {
	const [isVisible, setIsVisible] = useState<boolean>(isVisibleByDefault)

	const handleVisibilityChange = useCallback(() => {
		setIsVisible(document.visibilityState === "visible")
	}, [])

	useEvent("visibilitychange", handleVisibilityChange, document)

	return isVisible
}
