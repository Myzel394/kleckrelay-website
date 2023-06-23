import {ReactElement} from "react"
import {useTranslation} from "react-i18next"
import {HiKey} from "react-icons/hi"
import {TiCancel} from "react-icons/ti"
import {useAsync} from "react-use"
import {readKey} from "openpgp"

import {
	Box,
	Button,
	CircularProgress,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
} from "@mui/material"

import {FindPublicKeyResponse} from "~/apis"

export interface ImportKeyDialogProps {
	open: boolean
	publicKeyResult: FindPublicKeyResponse | null
	onClose: () => void
	onImport: () => void
}

export default function ImportKeyDialog({
	open,
	publicKeyResult,
	onClose,
	onImport,
}: ImportKeyDialogProps): ReactElement {
	const {t} = useTranslation(["settings-email-pgp", "common"])
	const {value: fingerprint, loading: isLoadingFingerprint} = useAsync(async () => {
		if (publicKeyResult === null) {
			return
		}

		const key = await readKey({
			armoredKey: publicKeyResult!.publicKey,
		})

		return key.getFingerprint()
	}, [publicKeyResult])

	return (
		<Dialog open={open} onClose={onClose}>
			<DialogTitle>{t("findPublicKey.title")}</DialogTitle>
			<DialogContent>
				<DialogContentText>
					{t("findPublicKey.description", {
						createdAt: publicKeyResult?.createdAt,
						type: publicKeyResult?.type,
					})}
				</DialogContentText>
				<Box my={2}>
					{isLoadingFingerprint ? <CircularProgress /> : <code>{fingerprint}</code>}
				</Box>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose} startIcon={<TiCancel />}>
					{t("general.cancelLabel", {ns: "common"})}
				</Button>
				<Button onClick={onImport} startIcon={<HiKey />} variant="contained">
					{t("findPublicKey.continueActionLabel")}
				</Button>
			</DialogActions>
		</Dialog>
	)
}
