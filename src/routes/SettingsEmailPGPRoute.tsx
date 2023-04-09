import {ReactElement} from "react"
import {useTranslation} from "react-i18next"

import {Alert} from "@mui/material"

import {SimplePage} from "~/components"
import {useUser} from "~/hooks"
import SetupPGPEncryptionForm from "~/route-widgets/SettingsEmailPGPRoute/SetupPGPEncryptionForm"

export default function SettingsEmailPGPRoute(): ReactElement {
	const {t} = useTranslation(["settings-email-pgp", "common"])
	const user = useUser()

	if (!user?.preferences.emailGpgPublicKey) {
		return (
			<SimplePage title={t("title")} description={t("description")}>
				<SetupPGPEncryptionForm />
			</SimplePage>
		)
	} else {
		return (
			<SimplePage title={t("title")} description={t("description")}>
				<Alert severity="success" variant="standard">
					{t("alreadyConfigured")}
				</Alert>
			</SimplePage>
		)
	}
}
