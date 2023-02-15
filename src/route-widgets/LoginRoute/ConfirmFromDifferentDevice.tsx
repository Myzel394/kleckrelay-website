import {ReactElement} from "react"
import {AxiosError} from "axios"
import {useMount} from "react-use"
import {useTranslation} from "react-i18next"

import {useMutation} from "@tanstack/react-query"
import {Box, Grid, Paper, Typography} from "@mui/material"

import {ServerUser} from "~/server-types"
import {verifyLoginWithEmail} from "~/apis"
import {LoadingData} from "~/components"

export interface ConfirmFromDifferentDeviceProps {
	email: string
	token: string

	onConfirm: (user: ServerUser) => void
}

export default function ConfirmFromDifferentDevice({
	email,
	token,
	onConfirm,
}: ConfirmFromDifferentDeviceProps): ReactElement {
	const {t} = useTranslation()
	const {mutate, isLoading, isError} = useMutation<ServerUser, AxiosError, void>(
		() =>
			verifyLoginWithEmail({
				email,
				token,
			}),
		{
			onSuccess: onConfirm,
		},
	)

	useMount(mutate)

	if (isLoading) {
		return (
			<Paper>
				<LoadingData />
			</Paper>
		)
	}

	if (isError) {
		return (
			<Paper>
				<Box padding={4}>
					<Grid container spacing={2} direction="column" alignItems="center">
						<Grid item>
							<Typography variant="h6" component="h1">
								{t("routes.LoginRoute.forms.confirmFromDifferentDevice.title")}
							</Typography>
						</Grid>
						<Grid item>
							<Typography variant="body1">
								{t(
									"routes.LoginRoute.forms.confirmFromDifferentDevice.description",
								)}
							</Typography>
						</Grid>
					</Grid>
				</Box>
			</Paper>
		)
	}

	return <></>
}
