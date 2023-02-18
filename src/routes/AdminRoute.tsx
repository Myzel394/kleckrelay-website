import {ReactElement, useLayoutEffect} from "react"
import {useTranslation} from "react-i18next"
import {BsStarFill} from "react-icons/bs"
import {AiFillEdit} from "react-icons/ai"
import {Link} from "react-router-dom"

import {List, ListItemButton, ListItemIcon, ListItemText} from "@mui/material"

import {SimplePageBuilder} from "~/components"
import {useNavigateToNext, useUser} from "~/hooks"
import ServerStatus from "~/route-widgets/AdminRoute/ServerStatus"

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
			<ServerStatus />
			<List>
				<ListItemButton component={Link} to="/admin/reserved-aliases">
					<ListItemIcon>
						<BsStarFill />
					</ListItemIcon>
					<ListItemText primary={t("routes.AdminRoute.routes.reservedAliases")} />
				</ListItemButton>
				<ListItemButton component={Link} to="/admin/settings">
					<ListItemIcon>
						<AiFillEdit />
					</ListItemIcon>
					<ListItemText primary={t("routes.AdminRoute.routes.settings")} />
				</ListItemButton>
			</List>
		</SimplePageBuilder.Page>
	)
}
