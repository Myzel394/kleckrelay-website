import {AxiosError} from "axios"
import {ReactElement} from "react"
import {useFormik} from "formik"
import {FaHashtag} from "react-icons/fa"
import {MdChevronRight, MdMail} from "react-icons/md"

import {useMutation} from "@tanstack/react-query"
import {Box, Grid, InputAdornment, TextField, Typography} from "@mui/material"
import {LoadingButton} from "@mui/lab"

import {AuthenticationDetails, ServerUser} from "~/server-types"
import {VerifyLoginWithEmailData, verifyLoginWithEmail} from "~/apis"
import {MultiStepFormElement} from "~/components"
import {parseFastapiError} from "~/utils"

import ResendMailButton from "./ResendMailButton"
import useSchema from "./use-schema"

export interface ConfirmCodeFormProps {
	onConfirm: (user: ServerUser) => void
	email: string
	sameRequestToken: string
}

interface Form {
	code: string
	detail: string
}

export default function ConfirmCodeForm({
	onConfirm,
	email,
	sameRequestToken,
}: ConfirmCodeFormProps): ReactElement {
	const schema = useSchema()
	const {mutateAsync} = useMutation<
		AuthenticationDetails,
		AxiosError,
		VerifyLoginWithEmailData
	>(verifyLoginWithEmail, {
		onSuccess: ({user}) => onConfirm(user),
	})
	const formik = useFormik<Form>({
		validationSchema: schema,
		initialValues: {
			code: "",
			detail: "",
		},
		onSubmit: async (values, {setErrors}) => {
			try {
				await mutateAsync({
					email,
					sameRequestToken,
					token: values.code,
				})
			} catch (error) {
				setErrors(parseFastapiError(error as AxiosError))
			}
		},
	})

	return (
		<MultiStepFormElement>
			<form onSubmit={formik.handleSubmit}>
				<Grid
					container
					spacing={4}
					padding={4}
					justifyContent="center"
					flexDirection="column"
				>
					<Grid item>
						<Typography variant="h6" component="h1" align="center">
							You got mail!
						</Typography>
					</Grid>
					<Grid item>
						<Box display="flex" justifyContent="center">
							<MdMail size={64} />
						</Box>
					</Grid>
					<Grid item>
						<Typography
							variant="subtitle1"
							component="p"
							align="center"
						>
							We sent you a code to your email. Enter it below to
							login.
						</Typography>
					</Grid>
					<Grid item>
						<TextField
							key="code"
							fullWidth
							name="code"
							id="code"
							label="code"
							value={formik.values.code}
							onChange={formik.handleChange}
							disabled={formik.isSubmitting}
							error={
								formik.touched.code &&
								Boolean(formik.errors.code)
							}
							helperText={
								formik.touched.code && formik.errors.code
							}
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<FaHashtag />
									</InputAdornment>
								),
							}}
						/>
					</Grid>
					<Grid item>
						<Grid
							width="100%"
							container
							display="flex"
							justifyContent="space-between"
						>
							<Grid item>
								<ResendMailButton
									email={email}
									sameRequestToken={sameRequestToken}
								/>
							</Grid>
							<Grid item>
								<LoadingButton
									loading={formik.isSubmitting}
									variant="contained"
									type="submit"
									startIcon={<MdChevronRight />}
								>
									Login
								</LoadingButton>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</form>
		</MultiStepFormElement>
	)
}
