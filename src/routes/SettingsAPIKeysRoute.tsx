import {ReactElement, useState} from "react"
import {useTranslation} from "react-i18next"
import {useQuery} from "@tanstack/react-query"
import {APIKey, PaginationResult} from "~/server-types"
import {AxiosError} from "axios"
import {getAPIKeys} from "~/apis"
import {QueryResult, SimplePage} from "~/components"
import {Button, List} from "@mui/material"
import {MdAdd} from "react-icons/md"
import APIKeyListItem from "~/route-widgets/SettingsAPIKeysRoute/APIKeyListItem"
import CreateNewAPIKeyDialog from "../route-widgets/SettingsAPIKeysRoute/CreateNewAPIKeyDialog"
import EmptyStateScreen from "~/route-widgets/SettingsAPIKeysRoute/EmptyStateScreen"

export default function SettingsAPIKeysRoute(): ReactElement {
	const {t} = useTranslation("settings-api-keys")
	const queryKey = ["get_api_keys"]
	const query = useQuery<PaginationResult<APIKey>, AxiosError>(queryKey, () => getAPIKeys())

	const [createdAPIKey, setCreatedAPIKey] = useState<(APIKey & {key: string}) | null>(null)
	const [createNew, setCreateNew] = useState<boolean>(false)

	return (
		<>
			<SimplePage
				title={t("title")}
				actions={
					<Button
						variant="contained"
						color="primary"
						onClick={() => setCreateNew(true)}
						startIcon={<MdAdd />}
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
									<APIKeyListItem
										apiKey={apiKey}
										key={apiKey.id}
										queryKey={queryKey}
										privateKey={
											apiKey.id === createdAPIKey?.id
												? createdAPIKey.key
												: undefined
										}
									/>
								))}
							</List>
						) : (
							<EmptyStateScreen />
						)
					}
				</QueryResult>
			</SimplePage>
			<CreateNewAPIKeyDialog
				key={createNew.toString()}
				open={createNew}
				onClose={() => setCreateNew(false)}
				onCreated={key => {
					query.refetch()
					setCreatedAPIKey(key)
				}}
			/>
		</>
	)
}
