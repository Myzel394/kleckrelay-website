import {useParams} from "react-router"
import {ReactElement, useContext, useState} from "react"
import {useTranslation} from "react-i18next"
import {MdContentCopy} from "react-icons/md"
import copy from "copy-to-clipboard"

import {Button, Grid} from "@mui/material"

import {
	AliasTypeIndicator,
	DecryptionPasswordMissingAlert,
	SimplePageBuilder,
	SuccessSnack,
} from "~/components"
import {Alias, DecryptedAlias} from "~/server-types"
import {useUIState} from "~/hooks"
import AliasNotesForm from "~/route-widgets/AliasDetailRoute/AliasNotesForm"
import AliasPreferencesForm from "~/route-widgets/AliasDetailRoute/AliasPreferencesForm"
import AuthContext, {EncryptionStatus} from "~/AuthContext/AuthContext"
import ChangeAliasActivationStatusSwitch from "~/route-widgets/AliasDetailRoute/ChangeAliasActivationStatusSwitch"

export interface AliasDetailsProps {
	alias: Alias | DecryptedAlias
}

export default function AliasDetails({alias: aliasValue}: AliasDetailsProps): ReactElement {
	const {t} = useTranslation()
	const params = useParams()
	const {encryptionStatus} = useContext(AuthContext)
	const address = atob(params.addressInBase64 as string)

	const [aliasUIState, setAliasUIState] = useUIState<Alias | DecryptedAlias>(aliasValue)
	const [hasCopiedToClipboard, setHasCopiedToClipboard] = useState<boolean>(false)

	return (
		<>
			<SimplePageBuilder.MultipleSections>
				{[
					<Grid key="basic" container spacing={1} direction="row" alignItems="center">
						<Grid item>
							<AliasTypeIndicator type={aliasUIState.type} />
						</Grid>
						<Grid item>
							<Button
								endIcon={<MdContentCopy />}
								variant="text"
								color="inherit"
								onClick={() => {
									copy(address)
									setHasCopiedToClipboard(true)
								}}
								sx={{textTransform: "none", fontWeight: "normal"}}
							>
								{address}
							</Button>
						</Grid>
						<Grid item>
							<ChangeAliasActivationStatusSwitch
								id={aliasUIState.id}
								isActive={aliasUIState.isActive}
								onChanged={setAliasUIState}
							/>
						</Grid>
					</Grid>,
					<div key="notes">
						{encryptionStatus === EncryptionStatus.Available ? (
							<AliasNotesForm
								id={aliasUIState.id}
								notes={(aliasUIState as DecryptedAlias).notes}
								onChanged={setAliasUIState}
							/>
						) : (
							<DecryptionPasswordMissingAlert />
						)}
					</div>,
					<SimplePageBuilder.Section
						label={t("routes.AliasDetailRoute.sections.settings.title")}
						key="settings"
					>
						<AliasPreferencesForm alias={aliasUIState} onChanged={setAliasUIState} />
					</SimplePageBuilder.Section>,
				]}
			</SimplePageBuilder.MultipleSections>
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
