import {ReactElement, useState, useTransition} from "react"
import {AxiosError} from "axios"
import {MdSearch} from "react-icons/md"
import {useTranslation} from "react-i18next"

import {useQuery} from "@tanstack/react-query"
import {InputAdornment, TextField} from "@mui/material"

import {AliasList, PaginationResult} from "~/server-types"
import {QueryResult, SimplePage} from "~/components"
import AliasesDetails from "~/route-widgets/AliasesRoute/AliasesDetails"
import EmptyStateScreen from "~/route-widgets/AliasesRoute/EmptyStateScreen"
import getAliases from "~/apis/get-aliases"

export default function AliasesRoute(): ReactElement {
	const {t} = useTranslation()

	const [searchValue, setSearchValue] = useState<string>("")
	const [queryValue, setQueryValue] = useState<string>("")
	const [, startTransition] = useTransition()

	const query = useQuery<PaginationResult<AliasList>, AxiosError>(
		["get_aliases", queryValue],
		() =>
			getAliases({
				query: queryValue,
			}),
	)

	return (
		<SimplePage
			title={t("routes.AliasesRoute.title")}
			pageOptionsActions={
				(query.data?.items?.length || 0) > 0 && (
					<TextField
						value={searchValue}
						onChange={event => {
							setSearchValue(event.target.value)
							startTransition(() => {
								setQueryValue(event.target.value)
							})
						}}
						label={t("routes.AliasesRoute.pageActions.search.label")}
						placeholder={t("routes.AliasesRoute.pageActions.search.placeholder")}
						id="search"
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<MdSearch />
								</InputAdornment>
							),
						}}
					/>
				)
			}
		>
			<QueryResult<PaginationResult<AliasList>, AxiosError> query={query}>
				{result => <AliasesDetails aliases={result.items} />}
			</QueryResult>
		</SimplePage>
	)
}
