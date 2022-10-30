import {ReactElement, useContext} from "react"
import {useParams} from "react-router-dom"
import {AxiosError} from "axios"

import {useQuery} from "@tanstack/react-query"
import {Grid, Typography} from "@mui/material"

import {getAlias} from "~/apis"
import {Alias, DecryptedAlias} from "~/server-types"
import {AliasTypeIndicator, QueryResult, SimplePage} from "~/components"
import {decryptAliasNotes} from "~/utils"
import AliasNotesForm from "~/route-widgets/AliasDetailRoute/AliasNotesForm"
import AliasPreferencesForm from "~/route-widgets/AliasDetailRoute/AliasPreferencesForm"
import AuthContext from "~/AuthContext/AuthContext"
import ChangeAliasActivationStatusSwitch from "~/route-widgets/AliasDetailRoute/ChangeAliasActivationStatusSwitch"
import DecryptionPasswordMissingAlert from "~/components/DecryptionPasswordMissingAlert"

export default function AliasDetailRoute(): ReactElement {
	const params = useParams()
	const {user, _decryptUsingMasterPassword} = useContext(AuthContext)
	const address = atob(params.addressInBase64 as string)

	const query = useQuery<Alias | DecryptedAlias, AxiosError>(
		["get_alias", params.addressInBase64],
		async () => {
			if (user?.encryptedPassword) {
				return decryptAliasNotes(
					await getAlias(address),
					_decryptUsingMasterPassword,
				)
			} else {
				return getAlias(address)
			}
		},
	)

	return (
		<SimplePage title="Alias Details">
			<QueryResult<Alias | DecryptedAlias> query={query}>
				{alias => (
					<Grid container spacing={4}>
						<Grid item>
							<Grid
								container
								spacing={1}
								direction="row"
								alignItems="center"
							>
								<Grid item>
									<AliasTypeIndicator type={alias.type} />
								</Grid>
								<Grid item>
									<Typography variant="subtitle1">
										{address}
									</Typography>
								</Grid>
								<Grid item>
									<ChangeAliasActivationStatusSwitch
										id={alias.id}
										isActive={alias.isActive}
										onChanged={query.refetch}
									/>
								</Grid>
							</Grid>
						</Grid>
						<Grid item width="100%">
							<Grid container direction="column" spacing={4}>
								<Grid item>
									<Typography variant="h6" component="h3">
										Notes
									</Typography>
								</Grid>
								<Grid item>
									{user?.encryptedPassword &&
									(alias as DecryptedAlias).notes ? (
										<AliasNotesForm
											id={alias.id}
											notes={
												(alias as DecryptedAlias).notes
											}
										/>
									) : (
										<DecryptionPasswordMissingAlert />
									)}
								</Grid>
							</Grid>
						</Grid>
						<Grid item>
							<Grid container spacing={4}>
								<Grid item>
									<Typography variant="h6" component="h3">
										Settings
									</Typography>
								</Grid>
								<Grid item>
									<Typography variant="body1">
										These settings apply to this alias only.
										You can either set a value manually or
										refer to your defaults settings. Note
										that this does change in behavior. When
										you set a value to refer to your default
										setting, the alias will always use the
										latest value. So when you change your
										default setting, the alias will
										automatically use the new value.
									</Typography>
								</Grid>
								<Grid item>
									<AliasPreferencesForm alias={alias} />
								</Grid>
							</Grid>
						</Grid>
					</Grid>
				)}
			</QueryResult>
		</SimplePage>
	)
}
