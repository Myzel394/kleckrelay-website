import {ReactElement, useState} from "react"
import {useParams} from "react-router-dom"
import {AxiosError} from "axios"

import {useMutation, useQuery} from "@tanstack/react-query"
import {Grid, Switch, Typography} from "@mui/material"

import {UpdateAliasData, getAlias, updateAlias} from "~/apis"
import {Alias} from "~/server-types"
import {ErrorSnack, SuccessSnack} from "~/components"
import {parseFastAPIError} from "~/utils"
import AliasPreferencesForm from "~/route-widgets/AliasDetailRoute/AliasPreferencesForm"
import AliasTypeIndicator from "~/components/AliasTypeIndicator"
import QueryResult from "~/components/QueryResult"
import SimplePage from "~/components/SimplePage"

export default function AliasDetailRoute(): ReactElement {
	const params = useParams()
	const address = atob(params.addressInBase64 as string)

	const [successMessage, setSuccessMessage] = useState<string>("")
	const [errorMessage, setErrorMessage] = useState<string>("")

	const [isActive, setIsActive] = useState<boolean>(true)
	const query = useQuery<Alias, AxiosError>(
		["get_alias", params.addressInBase64],
		() => getAlias(address),
		{
			onSuccess: alias => setIsActive(alias.isActive),
		},
	)
	const {mutateAsync} = useMutation<Alias, AxiosError, UpdateAliasData>(
		values => updateAlias(query.data!.id, values),
		{
			onSuccess: () => query.refetch(),
			onError: error => {
				setErrorMessage(parseFastAPIError(error).detail as string)
			},
		},
	)

	return (
		<>
			<SimplePage title="Alias Details">
				<QueryResult<Alias> query={query}>
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
							<Grid item>
								<Grid container spacing={4}>
									<Grid item>
										<Typography variant="h6">
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
