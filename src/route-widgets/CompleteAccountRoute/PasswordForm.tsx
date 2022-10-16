import * as yup from "yup"
import {useFormik} from "formik"
import {MdCheckCircle, MdChevronRight, MdLock} from "react-icons/md"
import {generateKey} from "openpgp"
import React, {ReactElement, useMemo} from "react"

import {LoadingButton} from "@mui/lab"
import {Box, Grid, InputAdornment, Typography} from "@mui/material"

import {PasswordField} from "~/components"
import {encryptString} from "~/utils"
import {isDev} from "~/constants/development"
import {useUser} from "~/hooks"
import {useMutation} from "@tanstack/react-query"

interface Form {
	password: string
	passwordConfirmation: string
	detail?: string
}

const schema = yup.object().shape({
	password: yup.string().required(),
	passwordConfirmation: yup
		.string()
		.required()
		.oneOf([yup.ref("password"), null], "Passwords must match"),
})

export default function PasswordForm(): ReactElement {
	const user = useUser()
	const {} = useMutation()
	const awaitGenerateKey = useMemo(
		() =>
			generateKey({
				type: "rsa",
				format: "armored",
				curve: "curve25519",
				userIDs: [{name: "John Smith", email: "john@example.com"}],
				passphrase: "",
				rsaBits: isDev ? 2048 : 4096,
			}),
		[],
	)
	const formik = useFormik<Form>({
		validationSchema: schema,
		initialValues: {
			password: "",
			passwordConfirmation: "",
		},
		onSubmit: async (values, {setErrors}) => {
			try {
				const keyPair = await awaitGenerateKey

				const encryptedPrivateKey = encryptString(
					keyPair.privateKey,
					`${values.password}-${user.email.address}`,
				)

				console.log(encryptedPrivateKey)
			} catch (error) {
				setErrors({detail: "An error occurred"})
			}
		},
	})

	return (
		<Box width="80vw">
			<form onSubmit={formik.handleSubmit}>
				<Grid
					container
					spacing={4}
					paddingX={2}
					paddingY={4}
					alignItems="center"
					justifyContent="center"
				>
					<Grid item>
						<Grid container spacing={2} direction="column">
							<Grid item>
								<Typography
									variant="h6"
									component="h2"
									align="center"
								>
									Set up your password
								</Typography>
							</Grid>
							<Grid item>
								<Typography variant="subtitle1" component="p">
									Please enter a safe password so that we can
									encrypt your data.
								</Typography>
							</Grid>
						</Grid>
					</Grid>
					<Grid item>
						<Grid container spacing={2} justifyContent="center">
							<Grid item>
								<PasswordField
									fullWidth
									id="password"
									name="password"
									label="Password"
									autoComplete="new-password"
									value={formik.values.password}
									onChange={formik.handleChange}
									disabled={formik.isSubmitting}
									error={
										formik.touched.password &&
										Boolean(formik.errors.password)
									}
									helperText={
										formik.touched.password &&
										formik.errors.password
									}
									InputProps={{
										startAdornment: (
											<InputAdornment position="start">
												<MdLock />
											</InputAdornment>
										),
									}}
								/>
							</Grid>
							<Grid item>
								<PasswordField
									fullWidth
									id="passwordConfirmation"
									name="passwordConfirmation"
									label="Confirm Password"
									value={formik.values.passwordConfirmation}
									onChange={formik.handleChange}
									disabled={formik.isSubmitting}
									error={
										formik.touched.passwordConfirmation &&
										Boolean(
											formik.errors.passwordConfirmation,
										)
									}
									helperText={
										formik.touched.passwordConfirmation &&
										formik.errors.passwordConfirmation
									}
									InputProps={{
										startAdornment: (
											<InputAdornment position="start">
												<MdCheckCircle />
											</InputAdornment>
										),
									}}
								/>
							</Grid>
						</Grid>
					</Grid>
					<Grid item>
						<LoadingButton
							type="submit"
							variant="contained"
							loading={formik.isSubmitting}
							startIcon={<MdChevronRight />}
						>
							Continue
						</LoadingButton>
					</Grid>
				</Grid>
			</form>
		</Box>
	)
}
