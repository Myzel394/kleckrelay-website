import {ReactElement, useMemo} from "react"
import {useAsyncFn} from "react-use"

import LoadingScreen from "~/LoadingScreen"

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
		return <LoadingScreen />
	}

	return (
		<AppLoadingScreenContext.Provider value={value}>
			{children}
		</AppLoadingScreenContext.Provider>
	)
}
