import {ReactElement, useState} from "react"
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

import {AliasTypeIndicator, SuccessSnack} from "~/components"
import {AliasList} from "~/server-types"
import {useUIState} from "~/hooks"
import CreateAliasButton from "~/route-widgets/AliasesRoute/CreateAliasButton"

export interface AliasesDetailsProps {
	aliases: AliasList[]
}

const getAddress = (alias: AliasList): string => `${alias.local}@${alias.domain}`

export default function AliasesDetails({aliases}: AliasesDetailsProps): ReactElement {
	const {t} = useTranslation()
	const [isInCopyAddressMode] = useKeyPress("Control")

	const [aliasesUIState, setAliasesUIState] = useUIState<AliasList[]>(aliases)
	const [hasCopiedToClipboard, setHasCopiedToClipboard] = useState<boolean>(false)

	return (
		<>
			<Grid container spacing={4} direction="column">
				<Grid item>
					<List>
						{aliasesUIState.map(alias => (
							<ListItemButton
								key={alias.id}
								onClick={event => {
									if (isInCopyAddressMode) {
										event.preventDefault()
										event.stopPropagation()
										copy(getAddress(alias))
										setHasCopiedToClipboard(true)
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
				</Grid>
				<Grid item>
					<CreateAliasButton
						onCreated={alias =>
							setAliasesUIState(currentAliases => [alias, ...currentAliases])
						}
					/>
				</Grid>
			</Grid>
			<SuccessSnack
				onClose={() => setHasCopiedToClipboard(false)}
				message={
					hasCopiedToClipboard &&
					t("relations.alias.mutations.success.addressCopiedToClipboard")
				}
			/>
		</>
	)
}
