import {ReactElement, useContext} from "react"
import {useLoaderData, useParams} from "react-router-dom"
import {AxiosError} from "axios"
import {useTranslation} from "react-i18next"

import {useQuery} from "@tanstack/react-query"
import {Grid} from "@mui/material"

import {deleteAlias, getAlias} from "~/apis"
import {Alias, DecryptedAlias, ServerSettings} from "~/server-types"
import {
	AliasTypeIndicator,
	AuthContext,
	DecryptionPasswordMissingAlert,
	DeleteButton,
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
	const serverSettings = useLoaderData() as ServerSettings
	const {id: aliasID} = useParams()
	const {_decryptUsingMasterPassword, encryptionStatus} = useContext(AuthContext)
	const queryKey = ["get_alias", aliasID, encryptionStatus]

	const query = useQuery<Alias | DecryptedAlias, AxiosError>(queryKey, async () => {
		const alias = await getAlias(aliasID!)

		if (encryptionStatus === EncryptionStatus.Available) {
			;(alias as any as DecryptedAlias).notes = decryptAliasNotes(
				alias.encryptedNotes,
				_decryptUsingMasterPassword,
			)
		}

		return alias
	})

	return (
		<SimplePage
			title={t("routes.AliasDetailRoute.title")}
			actions={
				serverSettings.allowAliasDeletion &&
				query.data && (
					<DeleteButton
						onDelete={() => deleteAlias(aliasID!)}
						label={t("routes.AliasDetailRoute.actions.delete.label")}
						description={t("routes.AliasDetailRoute.actions.delete.description")}
						continueLabel={t("routes.AliasDetailRoute.actions.delete.continueAction")}
						navigateTo={"/aliases"}
						successMessage={t("relations.alias.mutations.success.aliasDeleted")}
					/>
				)
			}
		>
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
									<AliasAddress address={`${alias.local}@${alias.domain}`} />
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
