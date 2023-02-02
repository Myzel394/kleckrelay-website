import {ReactElement, useLayoutEffect} from "react"
import {useTranslation} from "react-i18next"

import {SimplePageBuilder} from "~/components"
import {useNavigateToNext, useUser} from "~/hooks"
import ReservedAliasesForm from "~/route-widgets/AdminPage/ReservedAliasesForm"
import ReservedAliasesList from "~/route-widgets/AdminPage/ReservedAliasesList"

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
			<ReservedAliasesList />
			<ReservedAliasesForm />
		</SimplePageBuilder.Page>
	)
}
