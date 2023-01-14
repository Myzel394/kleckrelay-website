import {ReactElement, useContext} from "react"
import {useParams} from "react-router-dom"
import {AxiosError} from "axios"
import {useTranslation} from "react-i18next"

import {useQuery} from "@tanstack/react-query"
import {Grid} from "@mui/material"

import {getAlias} from "~/apis"
import {Alias, DecryptedAlias} from "~/server-types"
import {
	AliasTypeIndicator,
	AuthContext,
	DecryptionPasswordMissingAlert,
	EncryptionStatus,
	QueryResult,
	SimplePage,
	SimplePageBuilder,
} from "~/components"
import AliasAddress from "~/route-widgets/AliasDetailRoute/AliasAddress"
import AliasNotesForm from "~/route-widgets/AliasDetailRoute/AliasNotesForm"
import AliasPreferencesForm from "~/route-widgets/AliasDetailRoute/AliasPreferencesForm"
import ChangeAliasActivationStatusSwitch from "~/route-widgets/AliasDetailRoute/ChangeAliasActivationStatusSwitch"
import decryptAliasNotes from "~/apis/helpers/decrypt-alias-notes"

export default function AliasDetailRoute(): ReactElement {
	const {t} = useTranslation()
	const params = useParams()
	const address = atob(params.addressInBase64 as string)
	const {_decryptUsingMasterPassword, encryptionStatus} = useContext(AuthContext)
	const queryKey = ["get_alias", address, encryptionStatus]

	const query = useQuery<Alias | DecryptedAlias, AxiosError>(queryKey, async () => {
		const alias = await getAlias(address)

		if (encryptionStatus === EncryptionStatus.Available) {
			;(alias as any as DecryptedAlias).notes = decryptAliasNotes(
				alias.encryptedNotes,
				_decryptUsingMasterPassword,
			)
		}

		return alias
	})

	return (
		<SimplePage title={t("routes.AliasDetailRoute.title")}>
			<QueryResult<Alias | DecryptedAlias> query={query}>
				{alias => (
					<SimplePageBuilder.MultipleSections>
						{[
							<Grid
								key="basic"
								container
								spacing={1}
								direction="row"
								alignItems="center"
							>
								<Grid item>
									<AliasTypeIndicator type={alias.type} />
								</Grid>
								<Grid item>
									<AliasAddress address={address} />
								</Grid>
								<Grid item>
									<ChangeAliasActivationStatusSwitch
										id={alias.id}
										isActive={alias.isActive}
										queryKey={queryKey}
									/>
								</Grid>
							</Grid>,
							<div key="notes">
								{encryptionStatus === EncryptionStatus.Available ? (
									<AliasNotesForm
										id={alias.id}
										notes={(alias as DecryptedAlias).notes}
										queryKey={queryKey}
									/>
								) : (
									<DecryptionPasswordMissingAlert />
								)}
							</div>,
							<SimplePageBuilder.Section
								label={t("routes.AliasDetailRoute.sections.settings.title")}
								key="settings"
							>
								<AliasPreferencesForm alias={alias} queryKey={queryKey} />
							</SimplePageBuilder.Section>,
						]}
					</SimplePageBuilder.MultipleSections>
				)}
			</QueryResult>
		</SimplePage>
	)
}
