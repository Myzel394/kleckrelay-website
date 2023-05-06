import * as yup from "yup"
import {useLoaderData, useNavigate} from "react-router-dom"
import {MdCancel} from "react-icons/md"
import {AxiosError} from "axios"
import {useTranslation} from "react-i18next"
import React, {ReactElement, useContext, useEffect} from "react"

import {Grid, Paper, Typography, useTheme} from "@mui/material"
import {useMutation} from "@tanstack/react-query"

import {ServerSettings, ServerUser} from "~/server-types"
import {VerifyEmailData, verifyEmail} from "~/apis"
import {useQueryParams} from "~/hooks"
import {AuthContext} from "~/components"
import {useAsync} from "@react-hookz/web"

const emailSchema = yup.string().email()

export default function VerifyEmailRoute(): ReactElement {
	const {t} = useTranslation("verify-email")
	const theme = useTheme()
	const navigate = useNavigate()

	const {login} = useContext(AuthContext)
	const {email, token} = useQueryParams<{
		email: string
		token: string
	}>()
	const serverSettings = useLoaderData() as ServerSettings

	const tokenSchema = yup
		.string()
		.length(serverSettings.emailVerificationLength)
		.test("token", t("errors.invalid") as string, token => {
			if (!token) {
				return false
			}

			const chars = serverSettings.emailVerificationChars.split("")

			return token.split("").every(char => chars.includes(char))
		})
	const {mutateAsync} = useMutation<ServerUser, AxiosError, VerifyEmailData>(verifyEmail, {
		onSuccess: user => {
			login(user)
			navigate("/auth/complete-account")
		},
	})
	const [{status}, actions] = useAsync(async () => {
		await emailSchema.validate(email)
		await tokenSchema.validate(token)

		await mutateAsync({
			email,
			token,
		})
	})
	const isLoading = status == "loading"

	useEffect(() => {
		actions.reset()
		actions.execute()
	}, [actions.reset, actions.execute, email, token])

	return (
		<Paper>
			<Grid
				container
				spacing={4}
				padding={4}
				alignItems="center"
				justifyContent="center"
				flexDirection="column"
			>
				<Grid item>
					<Typography variant="h5" component="h1" align="center">
						{t("title")}
					</Typography>
				</Grid>
				{isLoading ? (
					<Grid item>
						<Typography variant="subtitle1" component="p" align="center">
							{t("isLoading")}
						</Typography>
					</Grid>
				) : (
					<>
						<Grid item>
							<MdCancel size={100} color={theme.palette.error.main} />
						</Grid>
						<Grid item>
							<Typography variant="subtitle1" component="p" align="center">
								{t("errors.invalid")}
							</Typography>
						</Grid>
					</>
				)}
			</Grid>
		</Paper>
	)
}
