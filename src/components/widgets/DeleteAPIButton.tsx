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

import {useErrorSuccessSnacks} from "~/hooks"

export interface DeleteAPIButtonProps {
	onDelete: () => Promise<any>
	label: string
	continueLabel?: string

	description?: string
	successMessage?: string
	navigateTo?: string
}

export default function DeleteAPIButton({
	onDelete,
	successMessage,
	label,
	continueLabel,
	description,
	navigateTo = "/aliases",
}: DeleteAPIButtonProps): ReactElement {
	const {t} = useTranslation("common")
	const {showError, showSuccess} = useErrorSuccessSnacks()
	const navigate = useNavigate()

	const {mutate} = useMutation<void, AxiosError, void>(onDelete, {
		onError: showError,
		onSuccess: () => {
			showSuccess(successMessage || t("messages.deletedObject"))
			navigate(navigateTo)
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
				{label}
			</Button>
			<Dialog open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)}>
				<DialogTitle>{label}</DialogTitle>
				<DialogContent>
					{description && <DialogContentText>{description}</DialogContentText>}
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
						{continueLabel}
					</Button>
				</DialogActions>
			</Dialog>
		</>
	)
}
