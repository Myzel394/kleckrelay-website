import {ReactElement} from "react"
import {AxiosError} from "axios"
import {useTranslation} from "react-i18next"

import {useQuery} from "@tanstack/react-query"
import {Alert} from "@mui/material"

import {QueryResult, SimplePageBuilder} from "~/components"
import Setup2FA from "~/route-widgets/Settings2FARoute/Setup2FA"
import getHas2FAEnabled from "~/apis/get-has-2fa-enabled"

export default function Settings2FARoute(): ReactElement {
	const {t} = useTranslation()
	const queryKey = ["get_2fa_enabled"]
	const query = useQuery<boolean, AxiosError>(queryKey, getHas2FAEnabled)

	return (
		<SimplePageBuilder.Page title={t("routes.SettingsRoute.2fa.title")}>
			<QueryResult<boolean, AxiosError> query={query}>
				{has2FAEnabled =>
					has2FAEnabled ? (
						<>
							<Alert severity="success">
								{t("routes.SettingsRoute.2fa.alreadyEnabled")}
							</Alert>
						</>
					) : (
						<Setup2FA onSuccess={query.refetch} />
					)
				}
			</QueryResult>
		</SimplePageBuilder.Page>
	)
}
