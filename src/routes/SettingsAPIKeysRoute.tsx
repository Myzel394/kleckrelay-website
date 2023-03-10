import {ReactElement} from "react"
import {useTranslation} from "react-i18next"
import {useQuery} from "@tanstack/react-query"
import {APIKey, PaginationResult} from "~/server-types"
import {AxiosError} from "axios"
import {getAPIKeys} from "~/apis"
import {QueryResult, SimplePage} from "~/components"
import {Button, List} from "@mui/material"
import {Link} from "react-router-dom"
import APIKeyListItem from "~/route-widgets/SettingsAPIKeysRoute/APIKeyListItem"
import EmptyStateScreen from "~/route-widgets/SettingsAPIKeysRoute/EmptyStateScreen"

export default function SettingsAPIKeysRoute(): ReactElement {
	const {t} = useTranslation("settings-api-keys")
	const query = useQuery<PaginationResult<APIKey>, AxiosError>(["get_api_keys"], () =>
		getAPIKeys(),
	)

	return (
		<SimplePage
			title={t("title")}
			actions={
				<Button
					variant="contained"
					color="primary"
					component={Link}
					to="/settings/api-keys/new"
				>
					{t("create.label")}
				</Button>
			}
		>
			<QueryResult<PaginationResult<APIKey>, AxiosError> query={query}>
				{({items: apiKeys}) =>
					apiKeys.length > 0 ? (
						<List>
							{apiKeys.map(apiKey => (
								<APIKeyListItem apiKey={apiKey} key={apiKey.id} />
							))}
						</List>
					) : (
						<EmptyStateScreen />
					)
				}
			</QueryResult>
		</SimplePage>
	)
}
