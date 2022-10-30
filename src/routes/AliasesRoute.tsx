import {ReactElement, useState} from "react"
import {AxiosError} from "axios"

import {useQuery} from "@tanstack/react-query"

import {AliasList, PaginationResult} from "~/server-types"
import AliasesDetails from "~/route-widgets/AliasesRoute/AliasesDetails"
import QueryResult from "~/components/QueryResult"
import SimplePage from "~/components/SimplePage"
import getAliases from "~/apis/get-aliases"

export default function AliasesRoute(): ReactElement {
	const query = useQuery<PaginationResult<AliasList>, AxiosError>(
		["get_aliases"],
		getAliases,
	)

	const [showCustomCreateDialog, setShowCustomCreateDialog] =
		useState<boolean>(false)

	return (
		<SimplePage title="Aliases">
			<QueryResult<PaginationResult<AliasList>> query={query}>
				{result => <AliasesDetails aliases={result.items} />}
			</QueryResult>
		</SimplePage>
	)
}
