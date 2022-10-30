import * as yup from "yup"
import {ReactElement, useContext} from "react"
import {useLocation, useNavigate} from "react-router-dom"
import {useFormik} from "formik"
import {MdLock} from "react-icons/md"

import {InputAdornment} from "@mui/material"

import {buildEncryptionPassword} from "~/utils"
import {useUser} from "~/hooks"
import {PasswordField, SimpleForm} from "~/components"
import AuthContext from "~/AuthContext/AuthContext"

interface Form {
	password: string
}

const schema = yup.object().shape({
	password: yup.string().required(),
})

export default function EnterDecryptionPassword(): ReactElement {
	const navigate = useNavigate()
	const location = useLocation()
	const user = useUser()
	const {_setDecryptionPassword} = useContext(AuthContext)

	const formik = useFormik<Form>({
		validationSchema: schema,
		initialValues: {
			password: "",
		},
		onSubmit: async ({password}, {setErrors}) => {
			const decryptionPassword = buildEncryptionPassword(
				password,
				user.email.address,
			)

			if (!_setDecryptionPassword(decryptionPassword)) {
				setErrors({password: "Password is invalid."})
			} else {
				const nextUrl =
					new URLSearchParams(location.search).get("next") || "/"
				navigate(nextUrl)
			}
		},
	})

	return (
		<form onSubmit={formik.handleSubmit}>
			<SimpleForm
				title="Decrypt reports"
				description="Please enter your password so that your reports can de decrypted."
				cancelActionLabel="Don't decrypt"
				continueActionLabel="Continue"
				isSubmitting={formik.isSubmitting}
			>
				{[
					<PasswordField
						key="password"
						fullWidth
						name="password"
						id="password"
						label="Password"
						value={formik.values.password}
						onChange={formik.handleChange}
						disabled={formik.isSubmitting}
						error={
							formik.touched.password &&
							Boolean(formik.errors.password)
						}
						helperText={
							formik.touched.password && formik.errors.password
						}
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
