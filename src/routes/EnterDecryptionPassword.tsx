import * as yup from "yup"
import {ReactElement, useContext, useLayoutEffect} from "react"
import {useFormik} from "formik"
import {MdLock} from "react-icons/md"
import {useTranslation} from "react-i18next"
import {useLoaderData, useNavigate} from "react-router-dom"

import {InputAdornment} from "@mui/material"

import {useNavigateToNext, useUser} from "~/hooks"
import {AuthContext, EncryptionStatus, PasswordField, SimpleForm} from "~/components"
import {getMasterPassword, getNextUrl} from "~/utils"
import {ServerSettings} from "~/server-types"

interface Form {
	password: string
}

export default function EnterDecryptionPassword(): ReactElement {
	const {t} = useTranslation(["decryption", "common"])
	const navigate = useNavigate()
	const navigateToNext = useNavigateToNext()
	const user = useUser()
	const {encryptionStatus} = useContext(AuthContext)
	const serverSettings = useLoaderData() as ServerSettings
	const {_setEncryptionPassword} = useContext(AuthContext)

	const schema = yup.object().shape({
		password: yup
			.string()
			.required()
			.label(t("fields.password.label", {ns: "common"})),
	})

	const formik = useFormik<Form>({
		validationSchema: schema,
		initialValues: {
			password: "",
		},
		onSubmit: async ({password}, {setErrors}) => {
			try {
				const masterPassword = await getMasterPassword(user, serverSettings, password)

				_setEncryptionPassword(masterPassword)
				navigateToNext()
			} catch (error) {
				// Password is incorrect
				setErrors({
					password: t("fields.password.errors,invalid", {ns: "common"}),
				})
			}
		},
	})

	useLayoutEffect(() => {
		if (encryptionStatus === EncryptionStatus.Unavailable) {
			const nextUrl = getNextUrl()

			navigate(`/auth/complete-account?setup=true&next=${nextUrl}`, {
				replace: true,
			})
		}
	}, [encryptionStatus])

	return (
		<form onSubmit={formik.handleSubmit}>
			<SimpleForm
				title={t("actions.enterDecryptionPassword.title")}
				description={t("actions.enterDecryptionPassword.description")}
				cancelActionLabel={t("actions.enterDecryptionPassword.cancelActionLabel")}
				isSubmitting={formik.isSubmitting}
				onCancel={navigateToNext}
			>
				{[
					<PasswordField
						key="password"
						fullWidth
						autoFocus
						name="password"
						id="password"
						label={t("fields.password.label", {ns: "common"})}
						placeholder={t("fields.password.placeholder", {ns: "common"})}
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
