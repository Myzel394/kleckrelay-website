import {ReactElement} from "react"
import {AxiosError} from "axios"
import _ from "lodash"

import {useQuery} from "@tanstack/react-query"

import {AdminSettings} from "~/server-types"
import {getAdminSettings} from "~/apis"
import {QueryResult} from "~/components"
import {DEFAULT_ADMIN_SETTINGS} from "~/constants/admin-settings"
import SettingsDisabled from "~/route-widgets/GlobalSettingsRoute/SettingsDisabled"
import SettingsForm from "~/route-widgets/GlobalSettingsRoute/SettingsForm"

export default function GlobalSettingsRoute(): ReactElement {
	const queryKey = ["get_admin_settings"]
	const query = useQuery<AdminSettings | null, AxiosError>(queryKey, async () => {
		const {code, detail, ...settings} = await getAdminSettings()

		if (code === "error:settings:global_settings_disabled") {
			return null
		} else {
			return _.mergeWith({}, DEFAULT_ADMIN_SETTINGS, settings, (o, s) =>
				_.isNull(s) ? o : s,
			) as AdminSettings
		}
	})

	return (
		<QueryResult<AdminSettings | null> query={query}>
			{settings =>
				settings === null ? (
					<SettingsDisabled />
				) : (
					<SettingsForm settings={settings} queryKey={queryKey} />
				)
			}
		</QueryResult>
	)
}
