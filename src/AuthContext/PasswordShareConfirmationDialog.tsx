import {ReactElement, useMemo, useState} from "react"
import {useTranslation} from "react-i18next"
import {TiCancel} from "react-icons/ti"

import {
	Alert,
	Button,
	Checkbox,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	FormControlLabel,
} from "@mui/material"

export interface PasswordShareConfirmationDialogProps {
	open: boolean
	onShare: (doNotAskAgain: boolean) => void
	onClose: () => void
}

export default function PasswordShareConfirmationDialog({
	open,
	onShare,
	onClose,
}: PasswordShareConfirmationDialogProps): ReactElement {
	const [doNotAskAgain, setDoNotAskAgain] = useState<boolean>(false)
	const askAmount = useMemo<number>(
		() => Number(sessionStorage.getItem("password-share-ask-amount") || 0) + 1,
		[],
	)
	const {t} = useTranslation()

	return (
		<Dialog open={open} onClose={onClose}>
			<DialogTitle>{t("components.passwordShareConfirmationDialog.title")}</DialogTitle>
			<DialogContent>
				<DialogContentText>
					{t("components.passwordShareConfirmationDialog.description")}
				</DialogContentText>
				<Alert severity="warning">
					{t("components.passwordShareConfirmationDialog.warning")}
				</Alert>
				{askAmount > 1 && (
					<FormControlLabel
						control={
							<Checkbox
								value={doNotAskAgain}
								onChange={event =>
									setDoNotAskAgain(event.target.value as any as boolean)
								}
							/>
						}
						label={t("components.passwordShareConfirmationDialog.doNotAskAgain")}
					/>
				)}
			</DialogContent>
			<DialogActions>
				<Button startIcon={<TiCancel />} onClick={onClose}>
					{t("components.general.cancelLabel")}
				</Button>
				<Button onClick={() => onShare(doNotAskAgain)}>
					{t("components.passwordShareConfirmationDialog.continueAction")}
				</Button>
			</DialogActions>
		</Dialog>
	)
}
