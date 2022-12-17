import * as yup from "yup"
import {ReactElement, useCallback, useRef} from "react"
import {AxiosError} from "axios"
import {useFormik} from "formik"
import {MdEmail} from "react-icons/md"
import {useTranslation} from "react-i18next"

import {useMutation} from "@tanstack/react-query"
import {InputAdornment, TextField} from "@mui/material"

import {LoginWithEmailResult, loginWithEmail} from "~/apis"
import {parseFastAPIError} from "~/utils"
import {MultiStepFormElement, SimpleForm} from "~/components"
import {useExtensionHandler} from "~/hooks"

export interface EmailFormProps {
	email: string
	onLogin: (email: string, sameRequestToken: string) => void
}

interface Form {
	email: string
	detail: string
}

export default function EmailForm({onLogin, email: preFilledEmail}: EmailFormProps): ReactElement {
	const {t} = useTranslation()

	const $password = useRef<HTMLInputElement | null>(null)
	const schema = yup.object().shape({
		email: yup
			.string()
			.email()
			.required()
			.label(t("routes.LoginRoute.forms.email.form.email.label")),
	})

	const {mutateAsync} = useMutation<LoginWithEmailResult, AxiosError, string>(loginWithEmail, {
		onSuccess: ({sameRequestToken}) => onLogin(formik.values.email, sameRequestToken),
	})
	const formik = useFormik<Form>({
		validationSchema: schema,
		initialValues: {
			email: preFilledEmail,
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

	const focusPassword = useCallback(() => $password.current?.focus(), [])

	useExtensionHandler({
		onEnterPassword: focusPassword,
	})

	return (
		<MultiStepFormElement>
			<form onSubmit={formik.handleSubmit}>
				<SimpleForm
					title={t("routes.LoginRoute.forms.email.title")}
					description={t("routes.LoginRoute.forms.email.description")}
					continueActionLabel={t("routes.LoginRoute.forms.email.continueAction")}
					nonFieldError={formik.errors.detail}
					isSubmitting={formik.isSubmitting}
				>
					{[
						<TextField
							key="email"
							fullWidth
							autoFocus
							name="email"
							id="email"
							label="Email"
							placeholder={t("routes.LoginRoute.forms.email.form.email.placeholder")}
							inputRef={$password}
							inputMode="email"
							value={formik.values.email}
							onChange={formik.handleChange}
							disabled={formik.isSubmitting}
							error={formik.touched.email && Boolean(formik.errors.email)}
							helperText={formik.touched.email && formik.errors.email}
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
