import {ReactElement} from "react"
import {useTranslation} from "react-i18next"
import {useKeyPress} from "react-use"
import {MdContentCopy} from "react-icons/md"
import {useSnackbar} from "notistack"
import {Link as RouterLink} from "react-router-dom"
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
import {useIsAnyInputFocused, useUIState} from "~/hooks"
import {SUCCESS_SNACKBAR_SHOW_DURATION} from "~/constants/values"
import CreateAliasButton from "~/route-widgets/AliasesRoute/CreateAliasButton"

export interface AliasesDetailsProps {
	aliases: AliasList[]
}

const getAddress = (alias: AliasList): string => `${alias.local}@${alias.domain}`

export default function AliasesDetails({aliases}: AliasesDetailsProps): ReactElement {
	const {t} = useTranslation()
	const {enqueueSnackbar} = useSnackbar()
	const [isPressingControl] = useKeyPress("Control")
	const isAnyInputFocused = useIsAnyInputFocused()

	const [aliasesUIState, setAliasesUIState] = useUIState<AliasList[]>(aliases)

	const isInCopyAddressMode = !isAnyInputFocused && isPressingControl

	return (
		<Grid container spacing={4} direction="column">
			<Grid item>
				<List>
					{aliasesUIState.map(alias => (
						<ListItemButton
							component={RouterLink}
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
							to={`/aliases/${btoa(getAddress(alias))}`}
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
