import {MdCheck} from "react-icons/md"
import {useSessionStorage} from "react-use"
import React, {ReactElement, useCallback, useEffect, useRef, useState} from "react"

import {
	Alert,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Grid,
} from "@mui/material"

export interface DetectEmailAutofillServiceProps {
	domains: string[]
}

enum AliasType {
	DuckDuckGo = "duck.com",
	SimpleLogin = "simplelogin.com",
}

const TYPE_NAME_MAP: Record<AliasType, string> = {
	[AliasType.DuckDuckGo]: "DuckDuckGo's Email Tracking Protection",
	[AliasType.SimpleLogin]: "SimpleLogin",
}

const STORAGE_KEY = "has-shown-email-autofill-service"

export default function DetectEmailAutofillService({
	domains,
}: DetectEmailAutofillServiceProps): ReactElement {
	const $hasDetected = useRef<boolean>(false)

	const [type, setType] = useState<AliasType | null>(null)
	const [hasShownModal, setHasShownModal] = useSessionStorage<boolean>(STORAGE_KEY, false)

	const handleFound = useCallback(
		(type: AliasType) => {
			if (domains.includes(type)) {
				if (!hasShownModal) {
					setType(type)

					setHasShownModal(true)
				}
			}
		},
		[domains.length, hasShownModal],
	)

	useEffect(() => {
		const checkDuckDuckGo = () => {
			const $element = document.querySelector("body > ddg-autofill")

			if ($element) {
				$hasDetected.current = true
				handleFound(AliasType.DuckDuckGo)
				return true
			}

			return false
		}
		const checkSimpleLogin = () => {
			const $element = document.querySelector("body > div.sl-button-wrapper")

			if (
				$element &&
				$element.children[0].nodeName === "DIV" &&
				$element.children[0].className === "sl-button"
			) {
				$hasDetected.current = true
				handleFound(AliasType.SimpleLogin)
				return true
			}

			return false
		}

		if (checkDuckDuckGo() || checkSimpleLogin()) {
			return
		}

		const observer = new MutationObserver(() => {
			if ($hasDetected.current) {
				return
			}

			checkDuckDuckGo()
			checkSimpleLogin()
		})

		observer.observe(document.body, {subtree: false, childList: true})

		return () => {
			observer.disconnect()
		}
	}, [handleFound])

	return (
		<Dialog open={type !== null} onClose={() => setType(null)}>
			<DialogTitle>Email relay service detected</DialogTitle>
			<DialogContent>
				<Grid container spacing={2} justifyContent="center">
					<Grid item>
						<DialogContentText>
							We detected that you are using an email relay service to sign up. This
							KleckRelay instance does not support relaying to another email relay
							service. You can either choose a different instance or sign up with a
							different email address.
						</DialogContentText>
					</Grid>
					<Grid item>
						<DialogContentText>Detected email relay:</DialogContentText>
					</Grid>
					<Grid item>
						<Alert severity="info">{TYPE_NAME_MAP[type!]}</Alert>
					</Grid>
				</Grid>
			</DialogContent>
			<DialogActions>
				<Button autoFocus startIcon={<MdCheck />} onClick={() => setType(null)}>
					Got it
				</Button>
			</DialogActions>
		</Dialog>
	)
}
