import * as yup from "yup"
import {useLoaderData, useNavigate} from "react-router-dom"
import {useAsync, useLocalStorage} from "react-use"
import {MdCancel} from "react-icons/md"
import {AxiosError} from "axios"
import React, {ReactElement, useContext} from "react"

import {Grid, Paper, Typography, useTheme} from "@mui/material"
import {useMutation} from "@tanstack/react-query"

import {AuthenticationDetails, ServerSettings} from "~/server-types"
import {VerifyEmailData, verifyEmail} from "~/apis"
import {useQueryParams} from "~/hooks"
import AuthContext from "~/AuthContext/AuthContext"

const emailSchema = yup.string().email()

export default function VerifyEmailRoute(): ReactElement {
	const theme = useTheme()
	const navigate = useNavigate()
	const {login} = useContext(AuthContext)
	const [_, setEmail] = useLocalStorage<string>("signup-form-state-email", "")
	const {email, token} = useQueryParams<{
		email: string
		token: string
	}>()
	const serverSettings = useLoaderData() as ServerSettings

	const tokenSchema = yup
		.string()
		.length(serverSettings.emailVerificationLength)
		.test("token", "Invalid token", token => {
			if (!token) {
				return false
			}

			const chars = serverSettings.emailVerificationChars.split("")

			return token.split("").every(char => chars.includes(char))
		})
	const {mutateAsync} = useMutation<
		AuthenticationDetails,
		AxiosError,
		VerifyEmailData
	>(verifyEmail, {
		onSuccess: ({user}) => {
			setEmail("")
			login(user)
			navigate("/auth/complete-account")
		},
	})
	const {loading} = useAsync(async () => {
		await emailSchema.validate(email)
		await tokenSchema.validate(token)

		await mutateAsync({
			email,
			token,
		})
	}, [email, token])

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
						Verify your email
					</Typography>
				</Grid>
				{loading ? (
					<Grid item>
						<Typography
							variant="subtitle1"
							component="p"
							align="center"
						>
							Verifying your email...
						</Typography>
					</Grid>
				) : (
					<>
						<Grid item>
							<MdCancel
								size={100}
								color={theme.palette.error.main}
							/>
						</Grid>
						<Grid item>
							<Typography
								variant="subtitle1"
								component="p"
								align="center"
							>
								Sorry, but this verification code is invalid.
							</Typography>
						</Grid>
					</>
				)}
			</Grid>
		</Paper>
	)
}
