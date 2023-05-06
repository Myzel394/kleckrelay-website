import {useCallback, useState} from "react"

import {useEventListener} from "@react-hookz/web"

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

	useEventListener(window, "focus", focusHandler, {capture: true})
	useEventListener(window, "blur", blurHandler, {capture: true})

	return isFocused
}
