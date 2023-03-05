import {ReactElement} from "react"
import {useTranslation} from "react-i18next"
import {TiCancel} from "react-icons/ti"
import {MdAccessTimeFilled, MdShield} from "react-icons/md"

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
	const {t} = useTranslation("extension")

	return (
		<Dialog open={open} onClose={() => onClose(false)} maxWidth="sm" fullWidth={false}>
			<DialogTitle>{t("sharePassword.title")}</DialogTitle>
			<DialogContent>
				<DialogContentText>{t("sharePassword.description")}</DialogContentText>
				<Box my={2}>
					<Alert severity="warning">{t("sharePassword.warning")}</Alert>
				</Box>
			</DialogContent>
			<DialogActions>
				<Box mr="auto">
					<Button startIcon={<MdAccessTimeFilled />} onClick={() => onClose(false)}>
						{t("sharePassword.decideLater")}
					</Button>
				</Box>
				<Button startIcon={<TiCancel />} onClick={() => onClose(true)}>
					{t("sharePassword.doNotAskAgain")}
				</Button>
				<Button color="error" onClick={onShare} startIcon={<MdShield />}>
					{t("sharePassword.sharePassword")}
				</Button>
			</DialogActions>
		</Dialog>
	)
}
