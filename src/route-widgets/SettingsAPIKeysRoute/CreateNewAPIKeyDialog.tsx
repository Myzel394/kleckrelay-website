import * as yup from "yup"
import {ReactElement} from "react"
import {
	Alert,
	Badge,
	Box,
	Button,
	Chip,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	FormControl,
	FormHelperText,
	Grid,
	InputAdornment,
	InputLabel,
	ListItem,
	ListItemIcon,
	ListItemText,
	MenuItem,
	Select,
	TextField,
} from "@mui/material"
import {useTranslation} from "react-i18next"
import {useFormik} from "formik"
import {CreateAPIKeyData, createAPIKey} from "~/apis"
import {APIKey, APIKeyScope, ServerSettings} from "~/server-types"
import {BiText} from "react-icons/bi"
import {CgProfile} from "react-icons/cg"
import {DatePicker} from "@mui/x-date-pickers"
import {useLoaderData} from "react-router-dom"
import {API_KEY_SCOPES} from "~/constants/values"
import {FaMask} from "react-icons/fa"
import {MdAdd, MdCancel, MdDelete, MdEdit, MdTextSnippet} from "react-icons/md"
import {GoSettings} from "react-icons/go"
import {TiEye} from "react-icons/ti"
import {useMutation} from "@tanstack/react-query"
import {AxiosError} from "axios"
import {parseFastAPIError} from "~/utils"
import {useErrorSuccessSnacks} from "~/hooks"
import addDays from "date-fns/addDays"
import diffInDays from "date-fns/differenceInDays"
import set from "date-fns/set"

export interface CreateNewAPIKeyDialogProps {
	open: boolean
	onClose: () => void
	onCreated: (key: APIKey & {key: string}) => void

	prefilledLabel: string
	prefilledScopes: APIKeyScope[]
}

const PRESET_DAYS: number[] = [1, 7, 30, 180, 360]

const API_KEY_SCOPE_ICON_MAP: Record<string, ReactElement> = {
	profile: <CgProfile />,
	alias: <FaMask />,
	report: <MdTextSnippet />,
	preferences: <GoSettings />,
}

const API_KEY_SCOPE_TYPE_ICON_MAP: Record<string, ReactElement> = {
	read: <TiEye />,
	create: <MdAdd />,
	update: <MdEdit />,
	delete: <MdDelete />,
}

const normalizeTime = (date: Date) =>
	set(date, {
		hours: 0,
		minutes: 0,
		seconds: 0,
		milliseconds: 0,
	})

export default function CreateNewAPIKeyDialog({
	open,
	prefilledLabel,
	prefilledScopes,
	onClose,
	onCreated,
}: CreateNewAPIKeyDialogProps): ReactElement {
	const {t} = useTranslation(["settings-api-keys", "common"])
	const serverSettings = useLoaderData() as ServerSettings
	const {showSuccess} = useErrorSuccessSnacks()

	const scheme = yup.object().shape({
		label: yup.string().required().label(t("create.form.label.label")),
		expiresAt: yup.date().required().label(t("create.form.expiresAt.label")),
		scopes: yup
			.array<APIKeyScope[]>()
			.of(yup.string())
			.required()
			.label(t("create.form.scopes.label")),
	})

	const {mutateAsync} = useMutation<APIKey & {key: string}, AxiosError, CreateAPIKeyData>(
		data => createAPIKey(data),
		{
			onSuccess: async key => {
				onClose()

				showSuccess(t("create.success"))

				onCreated(key)
			},
		},
	)
	const formik = useFormik<CreateAPIKeyData & {detail: string}>({
		validationSchema: scheme,
		initialValues: {
			label: prefilledLabel,
			expiresAt: addDays(new Date(), 30),
			scopes: [...prefilledScopes],
			detail: "",
		},
		onSubmit: async (values, {setErrors}) => {
			try {
				await mutateAsync(values)
			} catch (error) {
				setErrors(parseFastAPIError(error as AxiosError))
			}
		},
	})

	return (
		<Dialog open={open} onClose={onClose}>
			<DialogTitle>{t("create.label")}</DialogTitle>
			<form onSubmit={formik.handleSubmit}>
				<DialogContent>
					<DialogContentText>{t("create.description")}</DialogContentText>
					<Grid container spacing={4} mt={1}>
						<Grid item xs={12}>
							<TextField
								fullWidth
								name="label"
								id="label"
								label={t("create.form.label.label")}
								disabled={formik.isSubmitting}
								error={formik.touched.label && Boolean(formik.errors.label)}
								helperText={formik.touched.label && formik.errors.label}
								value={formik.values.label}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<BiText />
										</InputAdornment>
									),
								}}
							/>
						</Grid>
						<Grid item xs={12}>
							<FormControl
								fullWidth
								error={formik.touched.scopes && Boolean(formik.errors.scopes)}
							>
								<InputLabel htmlFor="scopes" id="scopes-label">
									{t("create.form.scopes.label")}
								</InputLabel>
								<Select<string[]>
									multiple
									fullWidth
									name="scopes"
									id="scopes"
									label={t("create.form.scopes.label")}
									disabled={formik.isSubmitting}
									error={formik.touched.scopes && Boolean(formik.errors.scopes)}
									value={formik.values.scopes}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									renderValue={(selected: string[]) => (
										<Box sx={{display: "flex", flexWrap: "wrap", gap: 0.5}}>
											{selected.map(value => (
												<Chip
													key={value}
													label={t(
														`values.scopes.${value.replace(":", "_")}`,
														{
															ns: "common",
														},
													)}
												/>
											))}
										</Box>
									)}
								>
									{API_KEY_SCOPES.map(scope => (
										<MenuItem key={scope} value={scope}>
											<ListItem>
												<ListItemIcon>
													<Badge
														badgeContent={
															API_KEY_SCOPE_TYPE_ICON_MAP[
																scope
																	.replace(":", "_")
																	.split("_")[0]
															]
														}
													>
														{
															API_KEY_SCOPE_ICON_MAP[
																scope
																	.replace(":", "_")
																	.split("_")[1]
															]
														}
													</Badge>
												</ListItemIcon>
												<ListItemText>
													{t(`values.scopes.${scope.replace(":", "_")}`, {
														ns: "common",
													})}
												</ListItemText>
											</ListItem>
										</MenuItem>
									))}
								</Select>
								<FormHelperText
									error={Boolean(formik.touched.scopes && formik.errors.scopes)}
								>
									{formik.touched.scopes && formik.errors.scopes}
								</FormHelperText>
							</FormControl>
						</Grid>
						<Grid item xs={12}>
							<Grid container spacing={1}>
								<Grid item xs={12}>
									<DatePicker
										value={formik.values.expiresAt}
										disabled={formik.isSubmitting}
										label={t("create.form.expiresAt.label")}
										slotProps={{
											textField: {
												fullWidth: true,
												name: "expiresAt",
												error:
													formik.touched.expiresAt &&
													Boolean(formik.errors.expiresAt),
												helperText:
													formik.touched.expiresAt &&
													formik.errors.expiresAt,
												onBlur: formik.handleBlur,
											},
										}}
										minDate={new Date()}
										maxDate={addDays(new Date(), serverSettings.apiKeyMaxDays)}
										onChange={value => formik.setFieldValue("expiresAt", value)}
									/>
									<FormHelperText
										error={
											formik.touched.expiresAt &&
											Boolean(formik.errors.expiresAt)
										}
									>
										{formik.touched.expiresAt && formik.errors.expiresAt}
									</FormHelperText>
								</Grid>
								<Grid item>
									<Grid container spacing={1} direction="row">
										{PRESET_DAYS.filter(
											days => days <= serverSettings.apiKeyMaxDays,
										).map(days => (
											<Grid item key={days}>
												<Chip
													label={t(
														`create.form.expiresAt.values.${days}days`,
													)}
													variant={
														diffInDays(
															formik.values.expiresAt!,
															normalizeTime(new Date()),
														) >= days
															? "filled"
															: "outlined"
													}
													onClick={() =>
														formik.setFieldValue(
															"expiresAt",
															addDays(
																normalizeTime(new Date()),
																days,
															),
														)
													}
												/>
											</Grid>
										))}
									</Grid>
								</Grid>
							</Grid>
						</Grid>
						{formik.errors.detail && (
							<Grid item xs={12}>
								<Alert severity="error">{formik.errors.detail}</Alert>
							</Grid>
						)}
					</Grid>
				</DialogContent>
				<DialogActions>
					<Button startIcon={<MdCancel />} onClick={onClose}>
						{t("general.cancelLabel", {ns: "common"})}
					</Button>
					<Button type="submit" variant="contained">
						{t("create.continueActionLabel")}
					</Button>
				</DialogActions>
			</form>
		</Dialog>
	)
}
