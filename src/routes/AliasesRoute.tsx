import {ReactElement} from "react"
import {AxiosError} from "axios"

import {Grid, List, Typography} from "@mui/material"
import {useQuery} from "@tanstack/react-query"

import {AliasList, PaginationResult} from "~/server-types"
import AliasListItem from "~/route-widgets/AliasRoute/AliasListItem"
import CreateRandomAliasButton from "~/route-widgets/AliasRoute/CreateRandomAliasButton"
import QueryResult from "~/components/QueryResult"
import getAliases from "~/apis/get-aliases"

export default function AliasesRoute(): ReactElement {
	const query = useQuery<PaginationResult<AliasList>, AxiosError>(
		["get_aliases"],
		getAliases,
	)

	return (
		<Grid direction="column" container spacing={4}>
			<Grid item>
				<Typography variant="h6" component="h2">
					Random Aliases
				</Typography>
			</Grid>
			<Grid item>
				<QueryResult<PaginationResult<AliasList>> query={query}>
					{result => (
						<List>
							{result.items.map(alias => (
								<AliasListItem key={alias.id} alias={alias} />
							))}
						</List>
					)}
				</QueryResult>
			</Grid>
			<Grid item>
				<CreateRandomAliasButton onCreated={() => query.refetch()} />
			</Grid>
		</Grid>
	)
}
