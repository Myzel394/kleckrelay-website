import {useMediaQuery} from "@react-hookz/web"

import {Theme} from "~/server-types"

export default function useSystemPreferredTheme(): Theme {
	const prefersDark = useMediaQuery("(prefers-color-scheme: dark)")

	return prefersDark ? Theme.DARK : Theme.LIGHT
}
