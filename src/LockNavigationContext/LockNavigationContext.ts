import {createContext} from "react"

export interface LockNavigationContextType {
	isLocked: boolean
	lock: () => void
	release: () => void
	navigate: (path: string) => void
	handleAnchorClick: (event: React.MouseEvent<HTMLAnchorElement>) => void
}

const LockNavigationContext = createContext<LockNavigationContextType>({
	isLocked: false,
	lock: () => {
		throw new Error("lock() not implemented")
	},
	release: () => {
		throw new Error("release() not implemented")
	},
	navigate: () => {
		throw new Error("navigate() not implemented")
	},
	handleAnchorClick: () => {
		throw new Error("handleAnchorClick() not implemented")
	},
})

export default LockNavigationContext
