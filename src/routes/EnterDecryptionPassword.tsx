import * as yup from "yup"
import {ReactElement, useContext} from "react"
import {useFormik} from "formik"
import {MdLock} from "react-icons/md"
import {useTranslation} from "react-i18next"

import {InputAdornment} from "@mui/material"

import {buildEncryptionPassword} from "~/utils"
import {useNavigateToNext, useUser} from "~/hooks"
import {PasswordField, SimpleForm} from "~/components"
import AuthContext from "~/AuthContext/AuthContext"

interface Form {
	password: string
}

export default function EnterDecryptionPassword(): ReactElement {
	const {t} = useTranslation()
	const navigateToNext = useNavigateToNext()
	const user = useUser()
	const {_setDecryptionPassword} = useContext(AuthContext)

	const schema = yup.object().shape({
		password: yup
			.string()
			.required()
			.label(t("components.EnterDecryptionPassword.form.password.label")),
	})

	const formik = useFormik<Form>({
		validationSchema: schema,
		initialValues: {
			password: "",
		},
		onSubmit: async ({password}, {setErrors}) => {
			const decryptionPassword = buildEncryptionPassword(password, user.email.address)

			if (!_setDecryptionPassword(decryptionPassword)) {
				setErrors({
					password: t(
						"components.EnterDecryptionPassword.form.password.errors.invalidPassword",
					),
				})
			} else {
				setTimeout(navigateToNext, 0)
			}
		},
	})

	return (
		<form onSubmit={formik.handleSubmit}>
			<SimpleForm
				title={t("components.EnterDecryptionPassword.title")}
				description={t("components.EnterDecryptionPassword.description")}
				cancelActionLabel={t("components.EnterDecryptionPassword.cancelAction")}
				continueActionLabel={t("components.EnterDecryptionPassword.continueAction")}
				isSubmitting={formik.isSubmitting}
			>
				{[
					<PasswordField
						key="password"
						fullWidth
						autoFocus
						name="password"
						id="password"
						label={t("components.EnterDecryptionPassword.form.password.label")}
						placeholder={t(
							"components.EnterDecryptionPassword.form.password.placeholder",
						)}
						value={formik.values.password}
						onChange={formik.handleChange}
						disabled={formik.isSubmitting}
						error={formik.touched.password && Boolean(formik.errors.password)}
						helperText={formik.touched.password && formik.errors.password}
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<MdLock />
								</InputAdornment>
							),
						}}
					/>,
				]}
			</SimpleForm>
		</form>
	)
}
