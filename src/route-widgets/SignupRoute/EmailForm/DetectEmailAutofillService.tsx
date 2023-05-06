import {MdCheck} from "react-icons/md"
import {useTranslation} from "react-i18next"
import React, {ReactElement, useCallback, useEffect, useRef, useState} from "react"

import {useSessionStorageValue} from "@react-hookz/web"
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
	const {t} = useTranslation("relay-service-detected")

	const $hasDetected = useRef<boolean>(false)

	const [type, setType] = useState<AliasType | null>(null)
	const {value: hasShownModal, set: setHasShownModal} = useSessionStorageValue<boolean>(
		STORAGE_KEY,
		{
			defaultValue: false,
		},
	)

	const handleFound = useCallback(
		(type: AliasType) => {
			if (domains.includes(type)) {
				if (!hasShownModal) {
					setType(type)

					setHasShownModal(true)
				}
			}
		},
		[domains.length, hasShownModal, setHasShownModal],
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
			<DialogTitle>{t("title")}</DialogTitle>
			<DialogContent>
				<Grid container spacing={2} justifyContent="center">
					<Grid item>
						<DialogContentText>{t("description")}</DialogContentText>
					</Grid>
					<Grid item>
						<DialogContentText>{t("detectedExplanation")}</DialogContentText>
					</Grid>
					<Grid item>
						<Alert severity="info">{TYPE_NAME_MAP[type!]}</Alert>
					</Grid>
				</Grid>
			</DialogContent>
			<DialogActions>
				<Button autoFocus startIcon={<MdCheck />} onClick={() => setType(null)}>
					{t("closeActionLabel")}
				</Button>
			</DialogActions>
		</Dialog>
	)
}
