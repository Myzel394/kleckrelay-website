import {ReactElement} from "react"
import {AxiosError} from "axios"

import {Grid, List, Typography} from "@mui/material"
import {useQuery} from "@tanstack/react-query"

import {Alias} from "~/server-types"
import AliasListItem from "~/route-widgets/AliasRoute/AliasListItem"
import CreateRandomAliasButton from "~/route-widgets/AliasRoute/CreateRandomAliasButton"
import LoadingData from "~/components/LoadingData"
import getAliases from "~/apis/get-aliases"

export default function AliasesRoute(): ReactElement {
	const {
		data: aliases,
		isLoading,
		refetch,
	} = useQuery<Array<Alias>, AxiosError>(["get_aliases"], getAliases)

	return (
		<Grid direction="column" container spacing={4}>
			<Grid item>
				<Typography variant="h6" component="h2">
					Random Aliases
				</Typography>
				<List>
					{isLoading ? (
						<LoadingData />
					) : (
						aliases?.map?.(alias => (
							<AliasListItem key={alias.id} alias={alias} />
						))
					)}
				</List>
			</Grid>
			<Grid item>
				<CreateRandomAliasButton onCreated={() => refetch()} />
			</Grid>
		</Grid>
	)
}
