import {ReactElement, useContext, useState} from "react"
import {useParams} from "react-router-dom"
import {AxiosError} from "axios"

import {useMutation, useQuery} from "@tanstack/react-query"
import {Grid, Switch, Typography} from "@mui/material"

import {UpdateAliasData, getAlias, updateAlias} from "~/apis"
import {Alias, DecryptedAlias} from "~/server-types"
import {
	AliasTypeIndicator,
	ErrorSnack,
	QueryResult,
	SimplePage,
	SuccessSnack,
} from "~/components"
import {decryptAliasNotes, parseFastAPIError} from "~/utils"
import AliasNotesForm from "~/route-widgets/AliasDetailRoute/AliasNotesForm"
import AliasPreferencesForm from "~/route-widgets/AliasDetailRoute/AliasPreferencesForm"
import AuthContext from "~/AuthContext/AuthContext"
import DecryptionPasswordMissingAlert from "~/components/DecryptionPasswordMissingAlert"

export default function AliasDetailRoute(): ReactElement {
	const params = useParams()
	const {user, _decryptUsingMasterPassword} = useContext(AuthContext)
	const address = atob(params.addressInBase64 as string)

	const [successMessage, setSuccessMessage] = useState<string>("")
	const [errorMessage, setErrorMessage] = useState<string>("")

	const [isActive, setIsActive] = useState<boolean>(true)
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
		{
			onSuccess: alias => setIsActive(alias.isActive),
		},
	)
	const {mutateAsync} = useMutation<Alias, AxiosError, UpdateAliasData>(
		values => updateAlias(query.data!.id, values),
		{
			onSuccess: () => query.refetch(),
			onError: error =>
				setErrorMessage(parseFastAPIError(error).detail as string),
		},
	)

	return (
		<>
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
										<Switch
											checked={isActive}
											onChange={async () => {
												setIsActive(!isActive)

												try {
													await mutateAsync({
														isActive,
													})

													if (isActive) {
														setSuccessMessage(
															"Alias activated successfully!",
														)
													} else {
														setSuccessMessage(
															"Alias deactivated successfully!",
														)
													}
												} catch {}
											}}
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
													(alias as DecryptedAlias)
														.notes
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
											These settings apply to this alias
											only. You can either set a value
											manually or refer to your defaults
											settings. Note that this does change
											in behavior. When you set a value to
											refer to your default setting, the
											alias will always use the latest
											value. So when you change your
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
			<SuccessSnack message={successMessage} />
			<ErrorSnack message={errorMessage} />
		</>
	)
}
