import {ReactElement, useState} from "react"
import {useNavigate} from "react-router-dom"
import {useTranslation} from "react-i18next"
import {MdDelete} from "react-icons/md"
import {TiCancel} from "react-icons/ti"
import {AxiosError} from "axios"

import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
} from "@mui/material"
import {useMutation} from "@tanstack/react-query"

import {deleteReport} from "~/apis"
import {useErrorSuccessSnacks} from "~/hooks"
import {SimpleDetailResponse} from "~/server-types"

export interface DeleteButtonProps {
	id: string
}

export default function ReportDetailRoute({id}: DeleteButtonProps): ReactElement {
	const {t} = useTranslation()
	const {showError, showSuccess} = useErrorSuccessSnacks()
	const navigate = useNavigate()

	const {mutate} = useMutation<SimpleDetailResponse, AxiosError, void>(() => deleteReport(id), {
		onError: showError,
		onSuccess: () => {
			showSuccess(t("relations.report.mutations.success.reportDeleted"))
			navigate("/reports")
		},
	})

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
					<Button
						variant="contained"
						startIcon={<MdDelete />}
						color="error"
						onClick={() => mutate()}
					>
						{t("routes.ReportDetailRoute.actions.delete.continueAction")}
					</Button>
				</DialogActions>
			</Dialog>
		</>
	)
}
