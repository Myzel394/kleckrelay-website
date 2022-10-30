import {ReactElement} from "react"

import {
	Grid,
	List,
	ListItemButton,
	ListItemIcon,
	ListItemText,
} from "@mui/material"

import {AliasTypeIndicator} from "~/components"
import {AliasList} from "~/server-types"
import {useUIState} from "~/hooks"
import CreateAliasButton from "~/route-widgets/AliasesRoute/CreateAliasButton"

export interface AliasesDetailsProps {
	aliases: AliasList[]
}

const getAddress = (alias: AliasList): string =>
	`${alias.local}@${alias.domain}`

export default function AliasesDetails({
	aliases,
}: AliasesDetailsProps): ReactElement {
	const [aliasesUIState, setAliasesUIState] = useUIState<AliasList[]>(aliases)

	return (
		<>
			<Grid container spacing={4} direction="column">
				<Grid item>
					<List>
						{aliasesUIState.map(alias => (
							<ListItemButton
								key={alias.id}
								href={`/aliases/${btoa(getAddress(alias))}`}
							>
								<ListItemIcon>
									<AliasTypeIndicator type={alias.type} />
								</ListItemIcon>
								<ListItemText primary={getAddress(alias)} />
							</ListItemButton>
						))}
					</List>
				</Grid>
				<Grid item>
					<CreateAliasButton
						onCreated={alias =>
							setAliasesUIState(currentAliases => [
								alias,
								...currentAliases,
							])
						}
					/>
				</Grid>
			</Grid>
		</>
	)
}
