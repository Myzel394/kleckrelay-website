import {ReactElement} from "react"
import {useTranslation} from "react-i18next"
import {TiCancel} from "react-icons/ti"
import {MdAccessTimeFilled, MdLock} from "react-icons/md"

import {
	Alert,
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
} from "@mui/material"

export interface PasswordShareConfirmationDialogProps {
	open: boolean
	onShare: () => void
	onClose: (doNotAskAgain: boolean) => void
}

export default function PasswordShareConfirmationDialog({
	open,
	onShare,
	onClose,
}: PasswordShareConfirmationDialogProps): ReactElement {
	const {t} = useTranslation()

	return (
		<Dialog open={open} onClose={() => onClose(false)} maxWidth="sm" fullWidth={false}>
			<DialogTitle>{t("components.passwordShareConfirmationDialog.title")}</DialogTitle>
			<DialogContent>
				<DialogContentText>
					{t("components.passwordShareConfirmationDialog.description")}
				</DialogContentText>
				<Box my={2}>
					<Alert severity="warning">
						{t("components.passwordShareConfirmationDialog.warning")}
					</Alert>
				</Box>
			</DialogContent>
			<DialogActions>
				<Box mr="auto">
					<Button startIcon={<MdAccessTimeFilled />} onClick={() => onClose(false)}>
						{t("components.passwordShareConfirmationDialog.decideLater")}
					</Button>
				</Box>
				<Button startIcon={<TiCancel />} onClick={() => onClose(true)}>
					{t("components.passwordShareConfirmationDialog.doNotShare")}
				</Button>
				<Button color="error" onClick={onShare} startIcon={<MdLock />}>
					{t("components.passwordShareConfirmationDialog.continueAction")}
				</Button>
			</DialogActions>
		</Dialog>
	)
}
