import * as yup from "yup"
import {useLoaderData} from "react-router-dom"
import {ReactElement, useContext, useState} from "react"
import {useFormik} from "formik"
import {HiSearch} from "react-icons/hi"
import {AxiosError} from "axios"
import {RiLockFill} from "react-icons/ri"
import {useTranslation} from "react-i18next"

import {LoadingButton} from "@mui/lab"
import {useMutation} from "@tanstack/react-query"
import {Box, FormGroup, FormHelperText, Grid, TextField} from "@mui/material"

import {
	FindPublicKeyResponse,
	UpdatePreferencesData,
	findPublicKey,
	updatePreferences,
} from "~/apis"
import {parseFastAPIError} from "~/utils"
import {ServerSettings, SimpleDetailResponse, User} from "~/server-types"
import {useErrorSuccessSnacks} from "~/hooks"
import {AuthContext} from "~/components"

import ImportKeyDialog from "./ImportKeyDialog"

interface Form {
	publicKey: string

	detail?: string
}

export default function SetupPGPEncryptionForm(): ReactElement {
	const {t} = useTranslation(["settings-email-pgp", "common"])
	const serverSettings = useLoaderData() as ServerSettings
	const {showSuccess, showError} = useErrorSuccessSnacks()

	const [publicKeyResult, setPublicKeyResult] = useState<FindPublicKeyResponse | null>(null)

	const schema = yup.object().shape({
		publicKey: yup.string().label(t("form.publicKey.label")).min(1),
	})
	const {user, _updateUser} = useContext(AuthContext)

	const {mutateAsync} = useMutation<SimpleDetailResponse, AxiosError, UpdatePreferencesData>(
		updatePreferences,
		{
			onSuccess: (response, values) => {
				const newUser = {
					...user,
					preferences: {
						...user!.preferences,
						...values,
					},
				} as User

				if (response.detail) {
					showSuccess(response?.detail)
				}

				_updateUser(newUser)
			},
		},
	)

	const formik = useFormik<Form>({
		validationSchema: schema,
		initialValues: {
			publicKey: user?.preferences.emailGpgPublicKey || "",
		},
		onSubmit: async (values, {setErrors}) => {
			try {
				await mutateAsync({
					emailGpgPublicKey: values.publicKey,
				})
			} catch (error) {
				setErrors(parseFastAPIError(error as AxiosError))
			}
		},
	})
	const {mutateAsync: findPublicKeyAsync, isLoading: isFindingPublicKey} = useMutation<
		FindPublicKeyResponse,
		AxiosError,
		void
	>(findPublicKey, {
		onSuccess: setPublicKeyResult,
		onError: showError,
	})

	return (
		<>
			<form onSubmit={formik.handleSubmit}>
				<Grid container spacing={4} direction="column" alignItems="stretch">
					<Grid item xs={12}>
						<FormGroup
							title={t("form.fields.publicKey.label")}
							key="publicKey"
							sx={{width: "100%"}}
						>
							<TextField
								fullWidth
								multiline
								minRows={5}
								maxRows={15}
								label={t("form.fields.publicKey.label")}
								placeholder={t("form.fields.publicKey.placeholder")}
								name="publicKey"
								value={formik.values.publicKey}
								onChange={formik.handleChange}
								error={Boolean(formik.errors.publicKey)}
								helperText={formik.errors.publicKey}
								disabled={formik.isSubmitting}
							/>
							<FormHelperText
								error={Boolean(formik.touched.publicKey && formik.errors.publicKey)}
							>
								{t("form.fields.publicKey.helperText")}
							</FormHelperText>
						</FormGroup>
						{serverSettings.allowPgpKeyDiscovery && (
							<Box mt={1}>
								<LoadingButton
									loading={isFindingPublicKey}
									type="button"
									startIcon={<HiSearch />}
									onClick={() => findPublicKeyAsync()}
								>
									{t("findPublicKey.label")}
								</LoadingButton>
							</Box>
						)}
					</Grid>
					<Grid item alignSelf="center">
						<LoadingButton
							loading={formik.isSubmitting}
							type="submit"
							variant="contained"
							startIcon={<RiLockFill />}
							disabled={!formik.isValid}
						>
							{t("form.continueActionLabel")}
						</LoadingButton>
					</Grid>
				</Grid>
			</form>
			<ImportKeyDialog
				open={Boolean(publicKeyResult)}
				publicKeyResult={publicKeyResult}
				onClose={() => setPublicKeyResult(null)}
				onImport={() => {
					formik.setFieldValue("publicKey", publicKeyResult!.publicKey || "")
					setPublicKeyResult(null)
				}}
			/>
		</>
	)
}
