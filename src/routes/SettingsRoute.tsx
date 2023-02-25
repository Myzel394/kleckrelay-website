import {useTranslation} from "react-i18next"
import {GoSettings} from "react-icons/go"
import {BsShieldLockFill} from "react-icons/bs"
import {Link} from "react-router-dom"
import React, {ReactElement} from "react"

import {List, ListItemButton, ListItemIcon, ListItemText} from "@mui/material"

import {SimplePageBuilder} from "~/components"

export default function SettingsRoute(): ReactElement {
	const {t} = useTranslation()

	return (
		<SimplePageBuilder.Page title={t("routes.SettingsRoute.title")}>
			<List>
				<ListItemButton component={Link} to="/settings/alias-preferences">
					<ListItemIcon>
						<GoSettings />
					</ListItemIcon>
					<ListItemText primary={t("routes.SettingsRoute.actions.aliasPreferences")} />
				</ListItemButton>
				<ListItemButton component={Link} to="/settings/2fa">
					<ListItemIcon>
						<BsShieldLockFill />
					</ListItemIcon>
					<ListItemText primary={t("routes.SettingsRoute.actions.enable2fa")} />
				</ListItemButton>
			</List>
		</SimplePageBuilder.Page>
	)
}
