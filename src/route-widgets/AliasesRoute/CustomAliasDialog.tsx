import * as yup from "yup"
import {ReactElement} from "react"
import {useFormik} from "formik"
import {useLoaderData} from "react-router-dom"
import {AxiosError} from "axios"
import {TiCancel} from "react-icons/ti"
import {FaPen} from "react-icons/fa"
import {useTranslation} from "react-i18next"

import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	InputAdornment,
	TextField,
	Typography,
} from "@mui/material"

import {AliasType, ServerSettings} from "~/server-types"
import {CreateAliasData} from "~/apis"
import {parseFastAPIError} from "~/utils"
import {LOCAL_REGEX} from "~/constants/values"

export interface CustomAliasDialogProps {
	visible: boolean
	onCreate: (values: CreateAliasData) => void
	isLoading: boolean
	onClose: () => void
}

interface Form {
	local: string

	detail?: string
}

export default function CustomAliasDialog({
	visible,
	isLoading,
	onCreate,
	onClose,
}: CustomAliasDialogProps): ReactElement {
	const serverSettings = useLoaderData() as ServerSettings
	const {t} = useTranslation()

	const schema = yup.object().shape({
		local: yup
			.string()
			.matches(LOCAL_REGEX)
			.required()
			.min(1)
			.max(64 - serverSettings.customAliasSuffixLength - 1),
	})

	const formik = useFormik<Form>({
		validationSchema: schema,
		initialValues: {
			local: "",
		},
		onSubmit: async (values, {setErrors}) => {
			try {
				await onCreate({
					local: values.local,
					type: AliasType.CUSTOM,
				})
				formik.resetForm()
			} catch (error) {
				setErrors(parseFastAPIError(error as AxiosError))
			}
		},
	})

	return (
		<Dialog onClose={onClose} open={visible} keepMounted={false}>
			<form onSubmit={formik.handleSubmit}>
				<DialogTitle>
					{t("routes.AliasesRoute.actions.createCustomAlias.label")}
				</DialogTitle>
				<DialogContent>
					<DialogContentText>
						{t(
							"routes.AliasesRoute.actions.createCustomAlias.description",
						)}
					</DialogContentText>
					<Box paddingY={4}>
						<TextField
							key="local"
							fullWidth
							autoFocus
							name="local"
							id="local"
							label={t(
								"routes.AliasesRoute.actions.createCustomAlias.form.address.label",
							)}
							placeholder={t(
								"routes.AliasesRoute.actions.createCustomAlias.form.address.placeholder",
							)}
							value={formik.values.local}
							onChange={formik.handleChange}
							disabled={formik.isSubmitting}
							error={
								formik.touched.local &&
								Boolean(formik.errors.local)
							}
							helperText={
								formik.touched.local && formik.errors.local
							}
							InputProps={{
								endAdornment: (
									<InputAdornment position="end">
										<Typography variant="body2">
											<span>
												{Array(
													serverSettings.customAliasSuffixLength,
												)
													.fill("#")
													.join("")}
											</span>
											<span>
												@{serverSettings.mailDomain}
											</span>
										</Typography>
									</InputAdornment>
								),
							}}
						/>
					</Box>
				</DialogContent>
				<DialogActions>
					<Button onClick={onClose} startIcon={<TiCancel />}>
						{t("general.cancelLabel")}
					</Button>
					<Button
						onClick={() => {}}
						disabled={isLoading}
						startIcon={<FaPen />}
						variant="contained"
						type="submit"
					>
						{t(
							"routes.AliasesRoute.actions.createCustomAlias.continueAction",
						)}
					</Button>
				</DialogActions>
			</form>
		</Dialog>
	)
}
