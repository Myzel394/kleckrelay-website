import {ReactElement, useState} from "react"
import {useTranslation} from "react-i18next"
import {MdCheck} from "react-icons/md"
import {TiCancel} from "react-icons/ti"

import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	TextField,
} from "@mui/material"

import {whenEnterPressed} from "~/utils"

export interface StringPoolFieldProps {
	onCreated: (value: string) => void
	onClose: () => void

	open?: boolean
}

export default function AddNewDialog({
	onCreated,
	open = false,
	onClose,
}: StringPoolFieldProps): ReactElement {
	const {t} = useTranslation()

	const [value, setValue] = useState<string>("")

	return (
		<Dialog open={open} onClose={onClose}>
			<DialogTitle>{t("components.StringPoolField.forms.addNew.title")}</DialogTitle>
			<DialogContent>
				<DialogContentText>
					{t("components.StringPoolField.forms.addNew.description")}
				</DialogContentText>
				<Box my={2}>
					<TextField
						value={value}
						onChange={e => setValue(e.target.value)}
						label={t("components.StringPoolField.forms.addNew.label")}
						name="addNew"
						fullWidth
						autoFocus
						onKeyUp={whenEnterPressed(() => onCreated(value))}
					/>
				</Box>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose} startIcon={<TiCancel />} variant="text">
					{t("general.cancelLabel")}
				</Button>
				<Button
					onClick={() => onCreated(value)}
					variant="contained"
					startIcon={<MdCheck />}
				>
					{t("components.StringPoolField.forms.addNew.submit")}
				</Button>
			</DialogActions>
		</Dialog>
	)
}
