import {ReactElement, useMemo} from "react"
import * as yup from "yup"
import {useFormik} from "formik"
import {Box, Grid, InputAdornment, Typography} from "@mui/material"
import {MdCheckCircle, MdChevronRight, MdLock} from "react-icons/md"
import {LoadingButton} from "@mui/lab"
import {PasswordField} from "components"
import handleErrors from "utils/handle-errors"
import {generateKey} from "openpgp"
import {isDev} from "constants/values"
import encryptString from "utils/encrypt-string"

export interface PasswordFormProps {
	email: string
}

interface Form {
	password: string
	passwordConfirmation: string
}

const schema = yup.object().shape({
	password: yup.string().required(),
	passwordConfirmation: yup
		.string()
		.required()
		.oneOf([yup.ref("password"), null], "Passwords must match"),
})

export default function PasswordForm({email}: PasswordFormProps): ReactElement {
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
		onSubmit: (values, {setErrors}) =>
			handleErrors(
				values,
				setErrors,
			)(async () => {
				const keyPair = await awaitGenerateKey

				const encryptedPrivateKey = encryptString(
					keyPair.privateKey,
					`${values.password}-${email}`,
				)

				console.log(encryptedPrivateKey)
			}),
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
