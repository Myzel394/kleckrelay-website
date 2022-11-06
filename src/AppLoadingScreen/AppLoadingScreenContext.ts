import {createContext} from "react"

export interface AppLoadingScreenContextType {
	setLoadingFunction: (callback: () => Promise<void>) => void
}

const AppLoadingScreenContext = createContext<AppLoadingScreenContextType>({
	setLoadingFunction: () => {
		throw new Error("setLoadingFunction() not implemented")
	},
})

export default AppLoadingScreenContext
