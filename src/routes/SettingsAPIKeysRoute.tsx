import {ReactElement, useLayoutEffect, useState} from "react"
import {useTranslation} from "react-i18next"
import {useQuery} from "@tanstack/react-query"
import {APIKey, APIKeyScope, PaginationResult} from "~/server-types"
import {AxiosError} from "axios"
import {getAPIKeys} from "~/apis"
import {QueryResult, SimplePage} from "~/components"
import {Button, List} from "@mui/material"
import {MdAdd} from "react-icons/md"
import {useQueryParams} from "~/hooks"
import {isArray} from "lodash"
import {API_KEY_SCOPES} from "~/constants/values"
import {useNavigate} from "react-router-dom"
import APIKeyListItem from "~/route-widgets/SettingsAPIKeysRoute/APIKeyListItem"
import CreateNewAPIKeyDialog from "../route-widgets/SettingsAPIKeysRoute/CreateNewAPIKeyDialog"
import EmptyStateScreen from "~/route-widgets/SettingsAPIKeysRoute/EmptyStateScreen"

export default function SettingsAPIKeysRoute(): ReactElement {
	const {t} = useTranslation("settings-api-keys")
	const navigate = useNavigate()

	const rawParams = useQueryParams<{action?: any; scopes?: any; label?: any}>()
	const params = {
		action: rawParams.action === "create-new" ? "create-new" : undefined,
		scopes: isArray(rawParams.scopes?.split(","))
			? rawParams.scopes
					.split(",")
					.filter((scope: APIKeyScope) => API_KEY_SCOPES.includes(scope))
			: [],
		label: rawParams.label,
	}

	const queryKey = ["get_api_keys"]
	const query = useQuery<PaginationResult<APIKey>, AxiosError>(queryKey, () => getAPIKeys())

	const [createdAPIKey, setCreatedAPIKey] = useState<(APIKey & {key: string}) | null>(null)
	const [createNew, setCreateNew] = useState<boolean>(params.action === "create-new")

	useLayoutEffect(() => {
		if (params.action === "create-new") {
			navigate(location.pathname, {replace: true})
		}
	}, [params.action, navigate])

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
				prefilledScopes={params.scopes}
				prefilledLabel={params.label}
				onClose={() => setCreateNew(false)}
				onCreated={key => {
					query.refetch()
					setCreatedAPIKey(key)
				}}
			/>
		</>
	)
}
