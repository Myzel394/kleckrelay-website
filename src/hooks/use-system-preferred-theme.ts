import {useMedia} from "react-use"

import {Theme} from "~/server-types"

export default function useSystemPreferredTheme(): Theme {
	const prefersDark = useMedia("(prefers-color-scheme: dark)")

	return prefersDark ? Theme.DARK : Theme.LIGHT
}
