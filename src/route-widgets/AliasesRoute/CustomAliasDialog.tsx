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
	const {t} = useTranslation(["aliases", "common"])

	const schema = yup.object().shape({
		local: yup
			.string()
			.matches(LOCAL_REGEX)
			.required()
			.min(1)
			.max(64 - serverSettings.customAliasSuffixLength - 1)
			.label(t("fields.customAliasLocal.label", {ns: "common"})),
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
				<DialogTitle>{t("actions.createCustomAlias.title")}</DialogTitle>
				<DialogContent>
					<DialogContentText>
						{t("actions.createCustomAlias.description")}
					</DialogContentText>
					<Box paddingY={4}>
						<TextField
							key="local"
							fullWidth
							autoFocus
							name="local"
							id="local"
							label={t("fields.customAliasLocal.label", {ns: "common"})}
							placeholder={t("fields.customAliasLocal.placeholder", {ns: "common"})}
							value={formik.values.local}
							onChange={formik.handleChange}
							disabled={formik.isSubmitting}
							error={formik.touched.local && Boolean(formik.errors.local)}
							helperText={formik.touched.local && formik.errors.local}
							InputProps={{
								endAdornment: (
									<InputAdornment position="end">
										<Typography variant="body2">
											<span>
												{Array(serverSettings.customAliasSuffixLength)
													.fill("#")
													.join("")}
											</span>
											<span>@{serverSettings.mailDomain}</span>
										</Typography>
									</InputAdornment>
								),
							}}
						/>
					</Box>
				</DialogContent>
				<DialogActions>
					<Button onClick={onClose} startIcon={<TiCancel />}>
						{t("general.cancelLabel", {ns: "common"})}
					</Button>
					<Button
						onClick={() => {}}
						disabled={isLoading}
						startIcon={<FaPen />}
						variant="contained"
						type="submit"
					>
						{t("actions.createCustomAlias.continueActionLabel")}
					</Button>
				</DialogActions>
			</form>
		</Dialog>
	)
}
