import {ReactElement, useState} from "react"
import {
	Alert,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Typography,
} from "@mui/material"
import {useTranslation} from "react-i18next"
import {MdDelete} from "react-icons/md"
import {TiCancel} from "react-icons/ti"

export interface DeleteButtonProps {
	id: string
}

export default function ReportDetailRoute({id}: DeleteButtonProps): ReactElement {
	const {t} = useTranslation()

	const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false)

	return (
		<>
			<Button
				variant="outlined"
				color="error"
				size="small"
				startIcon={<MdDelete />}
				onClick={() => setShowDeleteDialog(true)}
			>
				{t("routes.ReportDetailRoute.actions.delete.label")}
			</Button>
			<Dialog open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)}>
				<DialogTitle>{t("routes.ReportDetailRoute.actions.delete.label")}</DialogTitle>
				<DialogContent>
					<DialogContentText>
						{t("routes.ReportDetailRoute.actions.delete.description")}
					</DialogContentText>
					<DialogContentText color="error">
						{t("general.actionNotUndoable")}
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button startIcon={<TiCancel />} onClick={() => setShowDeleteDialog(false)}>
						{t("general.cancelLabel")}
					</Button>
					<Button startIcon={<MdDelete />} color="error">
						{t("routes.ReportDetailRoute.actions.delete.continueAction")}
					</Button>
				</DialogActions>
			</Dialog>
		</>
	)
}
