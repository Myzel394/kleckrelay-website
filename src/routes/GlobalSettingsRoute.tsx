import {ReactElement} from "react"
import {useQuery} from "@tanstack/react-query"
import {AdminSettings} from "~/server-types"
import {AxiosError} from "axios"
import {getAdminSettings} from "~/apis"
import {QueryResult} from "~/components"
import {useTranslation} from "react-i18next"
import SettingsForm from "~/route-widgets/GlobalSettingsRoute/SettingForm"

export default function GlobalSettingsRoute(): ReactElement {
	const {t} = useTranslation()
	const query = useQuery<AdminSettings, AxiosError>(["get_admin_settings"], getAdminSettings)

	return (
		<QueryResult<AdminSettings> query={query}>
			{settings => <SettingsForm settings={settings} />}
		</QueryResult>
	)
}
