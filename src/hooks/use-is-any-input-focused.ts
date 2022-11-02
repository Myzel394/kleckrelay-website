import {useCallback, useState} from "react"
import {useEvent} from "react-use"

export default function useIsAnyInputFocused(): boolean {
	const [isFocused, setIsFocused] = useState<boolean>(false)

	const focusHandler = useCallback<EventListener>(event => {
		const target = event.target as HTMLElement
		if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
			setIsFocused(true)
		}
	}, [])
	const blurHandler = useCallback<EventListener>(() => {
		setIsFocused(false)
	}, [])

	useEvent("focus", focusHandler, window, {capture: true})
	useEvent("blur", blurHandler, window, {capture: true})

	return isFocused
}
