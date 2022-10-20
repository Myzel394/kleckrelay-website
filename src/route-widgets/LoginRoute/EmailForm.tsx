import * as yup from "yup"
import {ReactElement} from "react"
import {AxiosError} from "axios"
import {useFormik} from "formik"
import {MdEmail} from "react-icons/md"

import {useMutation} from "@tanstack/react-query"
import {InputAdornment, TextField} from "@mui/material"

import {LoginWithEmailResult, loginWithEmail} from "~/apis"
import {parseFastAPIError} from "~/utils"
import {MultiStepFormElement, SimpleForm} from "~/components"

export interface EmailFormProps {
	onLogin: (email: string, sameRequestToken: string) => void
}

interface Form {
	email: string
	detail: string
}

const SCHEMA = yup.object().shape({
	email: yup.string().email().required(),
})

export default function EmailForm({onLogin}: EmailFormProps): ReactElement {
	const {mutateAsync} = useMutation<LoginWithEmailResult, AxiosError, string>(
		loginWithEmail,
		{
			onSuccess: ({sameRequestToken}) =>
				onLogin(formik.values.email, sameRequestToken),
		},
	)
	const formik = useFormik<Form>({
		validationSchema: SCHEMA,
		initialValues: {
			email: "",
			detail: "",
		},
		onSubmit: async (values, {setErrors}) => {
			try {
				await mutateAsync(values.email)
			} catch (error) {
				setErrors(parseFastAPIError(error as AxiosError))
			}
		},
	})

	return (
		<MultiStepFormElement>
			<form onSubmit={formik.handleSubmit}>
				<SimpleForm
					title="Sign in"
					description="We'll send you a verification code to your email."
					continueActionLabel="Send code"
					nonFieldError={formik.errors.detail}
					isSubmitting={formik.isSubmitting}
				>
					{[
						<TextField
							key="email"
							fullWidth
							name="email"
							id="email"
							label="Email"
							inputMode="email"
							value={formik.values.email}
							onChange={formik.handleChange}
							disabled={formik.isSubmitting}
							error={
								formik.touched.email &&
								Boolean(formik.errors.email)
							}
							helperText={
								formik.touched.email && formik.errors.email
							}
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<MdEmail />
									</InputAdornment>
								),
							}}
						/>,
					]}
				</SimpleForm>
			</form>
		</MultiStepFormElement>
	)
}
