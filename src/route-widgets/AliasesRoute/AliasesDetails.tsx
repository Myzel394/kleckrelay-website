import {ReactElement} from "react"
import {useTranslation} from "react-i18next"
import {useKeyPress} from "react-use"
import {MdContentCopy} from "react-icons/md"
import copy from "copy-to-clipboard"

import {
	Grid,
	List,
	ListItemButton,
	ListItemIcon,
	ListItemSecondaryAction,
	ListItemText,
} from "@mui/material"

import {AliasTypeIndicator} from "~/components"
import {AliasList} from "~/server-types"
import {useUIState} from "~/hooks"
import {useSnackbar} from "notistack"
import {SUCCESS_SNACKBAR_SHOW_DURATION} from "~/constants/values"
import CreateAliasButton from "~/route-widgets/AliasesRoute/CreateAliasButton"
import EmptyStateScreen from "~/route-widgets/AliasesRoute/EmptyStateScreen"

export interface AliasesDetailsProps {
	aliases: AliasList[]
}

const getAddress = (alias: AliasList): string => `${alias.local}@${alias.domain}`

export default function AliasesDetails({aliases}: AliasesDetailsProps): ReactElement {
	const {t} = useTranslation()
	const {enqueueSnackbar} = useSnackbar()
	const [isInCopyAddressMode] = useKeyPress("Control")

	const [aliasesUIState, setAliasesUIState] = useUIState<AliasList[]>(aliases)

	return (
		<Grid container spacing={4} direction="column">
			<Grid item>
				{aliasesUIState.length > 0 ? (
					<List>
						{aliasesUIState.map(alias => (
							<ListItemButton
								key={alias.id}
								onClick={event => {
									if (isInCopyAddressMode) {
										event.preventDefault()
										event.stopPropagation()

										copy(getAddress(alias))

										enqueueSnackbar(
											t(
												"relations.alias.mutations.success.addressCopiedToClipboard",
											),
											{
												variant: "success",
												autoHideDuration: SUCCESS_SNACKBAR_SHOW_DURATION,
											},
										)
									}
								}}
								href={`/aliases/${btoa(getAddress(alias))}`}
							>
								<ListItemIcon>
									<AliasTypeIndicator type={alias.type} />
								</ListItemIcon>
								<ListItemText primary={getAddress(alias)} />
								{isInCopyAddressMode && (
									<ListItemSecondaryAction>
										<MdContentCopy />
									</ListItemSecondaryAction>
								)}
							</ListItemButton>
						))}
					</List>
				) : (
					<EmptyStateScreen />
				)}
			</Grid>
			<Grid item>
				<CreateAliasButton
					onCreated={alias =>
						setAliasesUIState(currentAliases => [alias, ...currentAliases])
					}
				/>
			</Grid>
		</Grid>
	)
}
