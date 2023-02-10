import {ReactElement} from "react"
import {AxiosError} from "axios"
import _ from "lodash"

import {useQuery} from "@tanstack/react-query"

import {AdminSettings} from "~/server-types"
import {getAdminSettings} from "~/apis"
import {QueryResult} from "~/components"
import {DEFAULT_ADMIN_SETTINGS} from "~/constants/admin-settings"
import SettingsForm from "~/route-widgets/GlobalSettingsRoute/SettingsForm"

export default function GlobalSettingsRoute(): ReactElement {
	const query = useQuery<AdminSettings, AxiosError>(["get_admin_settings"], async () => {
		const settings = getAdminSettings()

		return _.mergeWith({}, DEFAULT_ADMIN_SETTINGS, settings, (o, s) =>
			_.isNull(s) ? o : s,
		) as AdminSettings
	})

	return (
		<QueryResult<AdminSettings> query={query}>
			{settings => <SettingsForm settings={settings} />}
		</QueryResult>
	)
}
