import {ReactElement, useState, useTransition} from "react"
import {AxiosError} from "axios"
import {MdSearch} from "react-icons/md"

import {useQuery} from "@tanstack/react-query"
import {InputAdornment, TextField} from "@mui/material"

import {AliasList, PaginationResult} from "~/server-types"
import {QueryResult, SimplePage} from "~/components"
import AliasesDetails from "~/route-widgets/AliasesRoute/AliasesDetails"
import getAliases from "~/apis/get-aliases"

export default function AliasesRoute(): ReactElement {
	const [searchValue, setSearchValue] = useState<string>("")
	const [queryValue, setQueryValue] = useState<string>("")
	const [, startTransition] = useTransition()

	const query = useQuery<PaginationResult<AliasList>, AxiosError, void>(
		["get_aliases", queryValue],
		() =>
			getAliases({
				query: queryValue,
			}),
	)

	return (
		<SimplePage
			title="Aliases"
			pageOptionsActions={
				<TextField
					value={searchValue}
					onChange={event => {
						setSearchValue(event.target.value)
						startTransition(() => {
							setQueryValue(event.target.value)
						})
					}}
					label="Search"
					id="search"
					InputProps={{
						startAdornment: (
							<InputAdornment position="start">
								<MdSearch />
							</InputAdornment>
						),
					}}
				/>
			}
		>
			<QueryResult<PaginationResult<AliasList>, AxiosError, void>
				query={query}
			>
				{result => <AliasesDetails aliases={result.items} />}
			</QueryResult>
		</SimplePage>
	)
}
