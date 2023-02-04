import {ReactElement, useLayoutEffect} from "react"
import {useTranslation} from "react-i18next"
import {BsStarFill} from "react-icons/bs"
import {Link} from "react-router-dom"

import {List, ListItemButton, ListItemIcon, ListItemText} from "@mui/material"

import {SimplePageBuilder} from "~/components"
import {useNavigateToNext, useUser} from "~/hooks"

export default function AdminRoute(): ReactElement {
	const {t} = useTranslation()
	const navigateToNext = useNavigateToNext()
	const user = useUser()

	useLayoutEffect(() => {
		if (!user.isAdmin) {
			navigateToNext()
		}
	}, [user.isAdmin, navigateToNext])

	return (
		<SimplePageBuilder.Page title={t("routes.AdminRoute.title")}>
			<List>
				<ListItemButton component={Link} to="/admin/reserved-aliases">
					<ListItemIcon>
						<BsStarFill />
					</ListItemIcon>
					<ListItemText primary={t("routes.AdminRoute.routes.reservedAliases")} />
				</ListItemButton>
			</List>
		</SimplePageBuilder.Page>
	)
}
