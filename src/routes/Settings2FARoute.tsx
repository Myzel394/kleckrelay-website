import {ReactElement} from "react"
import {AxiosError} from "axios"
import {useTranslation} from "react-i18next"

import {useQuery} from "@tanstack/react-query"
import {Alert} from "@mui/material"

import {QueryResult, SimplePageBuilder} from "~/components"
import getHas2FAEnabled from "~/apis/get-has-2fa-enabled"

export default function Settings2FARoute(): ReactElement {
	const {t} = useTranslation()
	const query = useQuery<boolean, AxiosError>(["get_2fa_enabled"], getHas2FAEnabled)

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
						<></>
					)
				}
			</QueryResult>
		</SimplePageBuilder.Page>
	)
}
