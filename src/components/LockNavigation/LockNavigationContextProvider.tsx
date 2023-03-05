import {TiCancel} from "react-icons/ti"
import {ReactNode, useMemo, useRef, useState} from "react"
import {useNavigate} from "react-router-dom"
import {MdLogout} from "react-icons/md"

import {useTranslation} from "react-i18next"
import LockNavigationContext, {LockNavigationContextType} from "./LockNavigationContext"

import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
} from "@mui/material"

export interface LockNavigationContextProviderProps {
	children: ReactNode
}

export default function LockNavigationContextProvider({
	children,
}: LockNavigationContextProviderProps): JSX.Element {
	const {t} = useTranslation(["components", "common"])
	const navigate = useNavigate()

	const [isLocked, setIsLocked] = useState<boolean>(false)
	const [nextPath, setNextPath] = useState<string | null>(null)
	const [showDialog, setShowDialog] = useState<boolean>(false)

	const $continueFunction = useRef<(() => void) | null>(null)
	const $cancelFunction = useRef<(() => void) | null>(null)

	const cancel = () => {
		setNextPath(null)
		setShowDialog(false)

		$cancelFunction.current?.()
		$continueFunction.current = null
		$cancelFunction.current = null
	}
	const leave = () => {
		setShowDialog(false)
		setIsLocked(false)

		$continueFunction.current?.()
		$continueFunction.current = null
		$cancelFunction.current = null

		if (nextPath) {
			const path = new URL(nextPath as string).pathname
			navigate(path)
		}

		setNextPath(null)
	}

	const value = useMemo(
		(): LockNavigationContextType => ({
			isLocked,
			navigate: (path: string) => {
				if (isLocked) {
					setNextPath(path)
					setShowDialog(true)
				} else {
					setNextPath(null)
					setShowDialog(false)
					navigate(path)
				}
			},
			handleAnchorClick: (event: React.MouseEvent<HTMLAnchorElement>) => {
				if (isLocked) {
					event.preventDefault()
					setNextPath(event.currentTarget.href)
					setShowDialog(true)
				}
			},
			lock: () => setIsLocked(true),
			release: () => {
				setIsLocked(false)
				setShowDialog(false)
			},
			showDialog: () =>
				new Promise((resolve, reject) => {
					setShowDialog(true)
					$continueFunction.current = resolve
					$cancelFunction.current = reject
				}),
		}),
		[isLocked],
	)

	return (
		<>
			<LockNavigationContext.Provider value={value}>
				{children}
			</LockNavigationContext.Provider>
			<Dialog open={showDialog} onClose={cancel}>
				<DialogTitle>{t("LockNavigationContextProvider.title")}</DialogTitle>
				<DialogContent>
					<DialogContentText>
						{t("LockNavigationContextProvider.description")}
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button startIcon={<TiCancel />} onClick={cancel}>
						{t("general.cancelLabel", {ns: "common"})}
					</Button>
					<Button startIcon={<MdLogout />} onClick={leave}>
						{t("LockNavigationContextProvider.continueLabel")}
					</Button>
				</DialogActions>
			</Dialog>
		</>
	)
}
