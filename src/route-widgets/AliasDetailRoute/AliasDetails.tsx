import {useParams} from "react-router"
import {ReactElement, useContext} from "react"

import {Grid, Typography} from "@mui/material"

import {AliasTypeIndicator, DecryptionPasswordMissingAlert} from "~/components"
import {Alias, DecryptedAlias} from "~/server-types"
import {useUIState} from "~/hooks"
import AliasNotesForm from "~/route-widgets/AliasDetailRoute/AliasNotesForm"
import AliasPreferencesForm from "~/route-widgets/AliasDetailRoute/AliasPreferencesForm"
import AuthContext, {EncryptionStatus} from "~/AuthContext/AuthContext"
import ChangeAliasActivationStatusSwitch from "~/route-widgets/AliasDetailRoute/ChangeAliasActivationStatusSwitch"

export interface AliasDetailsProps {
	alias: Alias | DecryptedAlias
}

const getDomain = (url: string): string => {
	const {hostname, port} = new URL(url)
	return `${hostname}${port ? `:${port}` : ""}`
}

export default function AliasDetails({
	alias: aliasValue,
}: AliasDetailsProps): ReactElement {
	const params = useParams()
	const {encryptionStatus} = useContext(AuthContext)
	const address = atob(params.addressInBase64 as string)

	const [aliasUIState, setAliasUIState] = useUIState<Alias | DecryptedAlias>(
		aliasValue,
	)

	return (
		<Grid container spacing={4}>
			<Grid item>
				<Grid container spacing={1} direction="row" alignItems="center">
					<Grid item>
						<AliasTypeIndicator type={aliasUIState.type} />
					</Grid>
					<Grid item>
						<Typography variant="subtitle1">{address}</Typography>
					</Grid>
					<Grid item>
						<ChangeAliasActivationStatusSwitch
							id={aliasUIState.id}
							isActive={aliasUIState.isActive}
							onChanged={setAliasUIState}
						/>
					</Grid>
				</Grid>
			</Grid>
			<Grid item width="100%">
				{encryptionStatus === EncryptionStatus.Available ? (
					<AliasNotesForm
						id={aliasUIState.id}
						notes={(aliasUIState as DecryptedAlias).notes}
						onChanged={setAliasUIState}
					/>
				) : (
					<DecryptionPasswordMissingAlert />
				)}
			</Grid>
			<Grid item>
				<Grid container spacing={4}>
					<Grid item>
						<Typography variant="h6" component="h3">
							Settings
						</Typography>
					</Grid>
					<Grid item>
						<AliasPreferencesForm
							alias={aliasUIState}
							onChanged={setAliasUIState}
						/>
					</Grid>
					<Grid item>
						<Typography variant="body2">
							These settings apply to this alias only. You can
							either set a value manually or refer to your default
							settings. Note that this does change in behavior.
							When you set a value to refer to your default
							setting, the alias will always use the latest value.
							So when you change your default setting, the alias
							will automatically use the new value.
						</Typography>
					</Grid>
				</Grid>
			</Grid>
		</Grid>
	)
}
