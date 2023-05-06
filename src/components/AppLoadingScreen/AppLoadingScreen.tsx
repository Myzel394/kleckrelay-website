import {ReactElement, useMemo} from "react"

import AppLoadingScreenContext, {AppLoadingScreenContextType} from "./AppLoadingScreenContext"

export interface AppLoadingScreenProps {
	children: ReactElement
}

export default function AppLoadingScreen({children}: AppLoadingScreenProps): ReactElement {
	const [state, setLoadingFunction] = useAsyncFn(callback => callback(), [])

	const value = useMemo<AppLoadingScreenContextType>(
		() => ({
			setLoadingFunction,
		}),
		[setLoadingFunction],
	)

	if (state.loading) {
		return <div>Loading...</div>
	}

	return (
		<AppLoadingScreenContext.Provider value={value}>
			{children}
		</AppLoadingScreenContext.Provider>
	)
}
