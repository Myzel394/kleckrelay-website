import {ReactElement, useState} from "react"
import {useTranslation} from "react-i18next"
import {useCopyToClipboard, useKeyPress, useUpdateEffect} from "react-use"

import {Alert, Grid, List, Snackbar} from "@mui/material"

import {AliasList} from "~/server-types"
import {useIsAnyInputFocused, useUIState} from "~/hooks"
import {ErrorSnack, SuccessSnack} from "~/components"
import AliasesListItem from "~/route-widgets/AliasesRoute/AliasesListItem"
import CreateAliasButton from "~/route-widgets/AliasesRoute/CreateAliasButton"

export interface AliasesDetailsProps {
	aliases: AliasList[]
}

export default function AliasesDetails({aliases}: AliasesDetailsProps): ReactElement {
	const {t} = useTranslation()
	const [{value, error}, copyToClipboard] = useCopyToClipboard()
	const [isPressingControl] = useKeyPress("Control")
	const isAnyInputFocused = useIsAnyInputFocused()

	const [aliasesUIState, setAliasesUIState] = useUIState<AliasList[]>(aliases)

	const [lockDisabledCopyMode, setLockDisabledCopyMode] = useState<boolean>(false)

	const isInCopyAddressMode = !isAnyInputFocused && !lockDisabledCopyMode && isPressingControl

	useUpdateEffect(() => {
		if (!isPressingControl) {
			setLockDisabledCopyMode(false)
		}
	}, [isPressingControl])

	return (
		<>
			<Grid container spacing={4} direction="column">
				<Grid item>
					<List>
						{aliasesUIState.map(alias => (
							<AliasesListItem
								alias={alias}
								key={alias.id}
								onCopy={
									isInCopyAddressMode
										? alias => {
												copyToClipboard(alias)
												setLockDisabledCopyMode(true)
										  }
										: undefined
								}
							/>
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
				key={value}
				message={value && t("relations.alias.mutations.success.addressCopiedToClipboard")}
			/>
			<ErrorSnack message={error && t("general.copyError")} />
			<Snackbar open={isInCopyAddressMode} autoHideDuration={null}>
				<Alert variant="standard" severity="info">
					{t("routes.AliasesRoute.isInCopyMode")}
				</Alert>
			</Snackbar>
		</>
	)
}
