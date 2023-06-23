import {ReactElement} from "react"
import {useTranslation} from "react-i18next"

import {SimplePage} from "~/components"
import {useUser} from "~/hooks"
import AlreadyConfigured from "~/route-widgets/SettingsEmailPGPRoute/AlreadyConfigured"
import SetupPGPEncryptionForm from "~/route-widgets/SettingsEmailPGPRoute/SetupPGPEncryptionForm"

export default function SettingsEmailPGPRoute(): ReactElement {
	const {t} = useTranslation(["settings-email-pgp", "common"])
	const user = useUser()

	return (
		<SimplePage title={t("title")} description={t("description")}>
			{user?.preferences.emailGpgPublicKey ? (
				<AlreadyConfigured />
			) : (
				<SetupPGPEncryptionForm />
			)}
		</SimplePage>
	)
}
