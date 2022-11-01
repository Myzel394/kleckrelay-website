import {useTranslation} from "react-i18next"
import React, {ReactElement} from "react"

import {SimplePageBuilder} from "~/components"
import AliasesPreferencesForm from "~/route-widgets/SettingsRoute/AliasesPreferencesForm"

export default function SettingsRoute(): ReactElement {
	const {t} = useTranslation()

	return (
		<SimplePageBuilder.Page title={t("routes.SettingsRoute.title")}>
			<AliasesPreferencesForm />
		</SimplePageBuilder.Page>
	)
}
