import {ReactElement, useState} from "react"
import {AxiosError} from "axios"

import {List} from "@mui/material"
import {useQuery} from "@tanstack/react-query"

import {AliasList, PaginationResult} from "~/server-types"
import AliasListItem from "~/route-widgets/AliasesRoute/AliasListItem"
import CreateAliasButton from "~/route-widgets/AliasesRoute/CreateAliasButton"
import CustomAliasDialog from "~/route-widgets/AliasesRoute/CustomAliasDialog"
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
		<>
			<SimplePage
				title="Aliases"
				actions={
					<CreateAliasButton
						onRandomCreated={() => query.refetch()}
						onCustomCreated={() => setShowCustomCreateDialog(true)}
					/>
				}
			>
				<QueryResult<PaginationResult<AliasList>> query={query}>
					{result => (
						<List>
							{result.items.map(alias => (
								<AliasListItem key={alias.id} alias={alias} />
							))}
						</List>
					)}
				</QueryResult>
			</SimplePage>
			<CustomAliasDialog
				visible={showCustomCreateDialog}
				onCreated={() => {
					setShowCustomCreateDialog(false)
					query.refetch()
				}}
				onClose={() => setShowCustomCreateDialog(false)}
			/>
		</>
	)
}
