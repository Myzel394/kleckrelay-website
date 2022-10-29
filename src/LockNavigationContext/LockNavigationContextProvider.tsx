import {TiCancel} from "react-icons/ti"
import {ReactNode, useMemo, useState} from "react"
import {useNavigate} from "react-router-dom"
import {MdLogout} from "react-icons/md"

import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
} from "@mui/material"

import LockNavigationContext, {
	LockNavigationContextType,
} from "./LockNavigationContext"

export interface LockNavigationContextProviderProps {
	children: ReactNode
}

export default function LockNavigationContextProvider({
	children,
}: LockNavigationContextProviderProps): JSX.Element {
	const navigate = useNavigate()

	const [isLocked, setIsLocked] = useState<boolean>(false)
	const [nextPath, setNextPath] = useState<string | null>(null)

	const showDialog = Boolean(nextPath)

	const value = useMemo(
		(): LockNavigationContextType => ({
			isLocked,
			navigate: (path: string) => {
				if (isLocked) {
					setNextPath(path)
				} else {
					setNextPath(null)
					navigate(path)
				}
			},
			handleAnchorClick: (event: React.MouseEvent<HTMLAnchorElement>) => {
				if (isLocked) {
					event.preventDefault()
					setNextPath(event.currentTarget.href)
				}
			},
			lock: () => setIsLocked(true),
			release: () => setIsLocked(false),
		}),
		[isLocked],
	)

	return (
		<>
			<LockNavigationContext.Provider value={value}>
				{children}
			</LockNavigationContext.Provider>
			<Dialog open={showDialog} onClose={() => setNextPath(null)}>
				<DialogTitle>Are you sure you want to go?</DialogTitle>
				<DialogContent>
					<DialogContentText>
						You have unsaved changes. If you leave this page, your
						changes will be lost.
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button
						startIcon={<TiCancel />}
						onClick={() => setNextPath(null)}
					>
						Cancel
					</Button>
					<Button
						startIcon={<MdLogout />}
						onClick={() => {
							const path = new URL(nextPath as string).pathname
							setNextPath(null)
							setIsLocked(false)
							navigate(path)
						}}
					>
						Leave
					</Button>
				</DialogActions>
			</Dialog>
		</>
	)
}
