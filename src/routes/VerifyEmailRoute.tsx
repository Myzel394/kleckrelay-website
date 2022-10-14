import * as yup from "yup"
import {useLoaderData, useParams} from "react-router-dom"
import {useAsync} from "react-use"
import {MdCancel} from "react-icons/md"
import React, {ReactElement} from "react"

import {Grid, Paper, Typography, useTheme} from "@mui/material"

import {ServerSettings} from "~/types"
import {validateEmail} from "~/apis"

const emailSchema = yup.string().email()

export default function VerifyEmailRoute(): ReactElement {
	const theme = useTheme()
	const {email, token} = useParams<{
		email: string
		token: string
	}>()
	const serverSettings = useLoaderData() as ServerSettings

	const tokenSchema = yup
		.string()
		.length(serverSettings.email_verification_length)
		.test("token", "Invalid token", token => {
			if (!token) {
				return false
			}

			// Check token only contains chars from `serverSettings.email_verification_chars`
			const chars = serverSettings.email_verification_chars.split("")
			return token.split("").every(chars.includes)
		})
	const {error, loading} = useAsync(async () => {
		await emailSchema.validate(email)
		await tokenSchema.validate(token)

		await validateEmail({
			token: token as string,
			email: email as string,
		})

		return true
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
								Sorry, but this token is invalid.
							</Typography>
						</Grid>
					</>
				)}
			</Grid>
		</Paper>
	)
}
