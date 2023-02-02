import {ReactElement} from "react"
import {AxiosError} from "axios"

import {useQuery} from "@tanstack/react-query"
import {List, ListItem, ListItemText} from "@mui/material"

import {getReservedAliases} from "~/apis"
import {PaginationResult, ReservedAlias} from "~/server-types"
import {QueryResult} from "~/components"

export interface ReservedAliasesListProps {}

export default function ReservedAliasesList({}: ReservedAliasesListProps): ReactElement {
	const query = useQuery<PaginationResult<ReservedAlias>, AxiosError>(
		["getReservedAliases"],
		() => getReservedAliases(),
	)

	return (
		<QueryResult<PaginationResult<ReservedAlias>, AxiosError> query={query}>
			{({items}) => (
				<List>
					{items.map(alias => (
						<ListItem key={alias.id}>
							<ListItemText primary={`${alias.local}@${alias.domain}`} />
						</ListItem>
					))}
				</List>
			)}
		</QueryResult>
	)
}
