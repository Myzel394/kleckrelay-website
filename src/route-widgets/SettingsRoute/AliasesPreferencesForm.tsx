import * as yup from "yup"
import {AxiosError} from "axios"
import {useFormik} from "formik"
import {MdCheckCircle, MdImage} from "react-icons/md"
import {useTranslation} from "react-i18next"
import React, {ReactElement, useContext} from "react"

import {useMutation} from "@tanstack/react-query"
import {
	Alert,
	Checkbox,
	Collapse,
	FormControlLabel,
	FormGroup,
	FormHelperText,
	Grid,
	InputAdornment,
	MenuItem,
	TextField,
	Typography,
	useMediaQuery,
	useTheme,
} from "@mui/material"
import {LoadingButton} from "@mui/lab"

import {ImageProxyFormatType, ProxyUserAgentType, SimpleDetailResponse} from "~/server-types"
import {UpdatePreferencesData, updatePreferences} from "~/apis"
import {useErrorSuccessSnacks, useUser} from "~/hooks"
import {parseFastAPIError} from "~/utils"
import {
	IMAGE_PROXY_FORMAT_TYPE_NAME_MAP,
	PROXY_USER_AGENT_TYPE_NAME_MAP,
} from "~/constants/enum-mappings"
import {AuthContext} from "~/components"

interface Form {
	removeTrackers: boolean
	createMailReport: boolean
	proxyImages: boolean
	imageProxyFormat: ImageProxyFormatType
	proxyUserAgent: ProxyUserAgentType
	expandUrlShorteners: boolean

	detail?: string
}

export default function AliasesPreferencesForm(): ReactElement {
	const {_updateUser} = useContext(AuthContext)
	const user = useUser()
	const {showError, showSuccess} = useErrorSuccessSnacks()
	const {t} = useTranslation()

	const schema = yup.object().shape({
		removeTrackers: yup.boolean().label(t("relations.alias.settings.removeTrackers.label")),
		createMailReport: yup
			.boolean()
			.label(t("relations.alias.settings.createMailReports.label")),
		proxyImages: yup.boolean().label(t("relations.alias.settings.proxyImages.label")),
		imageProxyFormat: yup
			.mixed<ImageProxyFormatType>()
			.oneOf(Object.values(ImageProxyFormatType))
			.required()
			.label(t("relations.alias.settings.imageProxyFormat.label")),
		proxyUserAgent: yup
			.mixed<ProxyUserAgentType>()
			.oneOf(Object.values(ProxyUserAgentType))
			.required()
			.label(t("relations.alias.settings.proxyUserAgent.label")),
		expandUrlShorteners: yup
			.boolean()
			.label(t("relations.alias.settings.expandUrlShorteners.label")),
	})

	const {mutateAsync} = useMutation<SimpleDetailResponse, AxiosError, UpdatePreferencesData>(
		updatePreferences,
		{
			onSuccess: (response, values) => {
				const newUser = {
					...user,
					preferences: {
						...user.preferences,
						...values,
					},
				}

				if (response.detail) {
					showSuccess(response?.detail)
				}

				_updateUser(newUser)
			},
			onError: showError,
		},
	)
	const formik = useFormik<Form>({
		validationSchema: schema,
		initialValues: {
			removeTrackers: user.preferences.aliasRemoveTrackers,
			createMailReport: user.preferences.aliasCreateMailReport,
			proxyImages: user.preferences.aliasProxyImages,
			imageProxyFormat: user.preferences.aliasImageProxyFormat,
			proxyUserAgent: user.preferences.aliasProxyUserAgent,
			expandUrlShorteners: user.preferences.aliasExpandUrlShorteners || true,
		},
		onSubmit: async (values, {setErrors}) => {
			try {
				await mutateAsync({
					aliasRemoveTrackers: values.removeTrackers,
					aliasCreateMailReport: values.createMailReport,
					aliasProxyImages: values.proxyImages,
					aliasImageProxyFormat: values.imageProxyFormat,
					aliasProxyUserAgent: values.proxyUserAgent,
					aliasExpandUrlShorteners: values.expandUrlShorteners,
				})
			} catch (error) {
				setErrors(parseFastAPIError(error as AxiosError))
			}
		},
	})
	const theme = useTheme()
	const isLarge = useMediaQuery(theme.breakpoints.up("md"))

	return (
		<form onSubmit={formik.handleSubmit}>
			<Grid container spacing={4} flexDirection="column" alignItems="center">
				<Grid item>
					<Typography variant="h6" component="h3">
						{t("routes.SettingsRoute.forms.aliasPreferences.title")}
					</Typography>
				</Grid>
				<Grid item>
					<Typography variant="body1" component="p">
						{t("routes.SettingsRoute.forms.aliasPreferences.description")}
					</Typography>
				</Grid>
				<Grid item>
					<Grid
						display="flex"
						flexDirection="row"
						container
						spacing={4}
						alignItems="flex-end"
					>
						<Grid item md={6} xs={12}>
							<FormGroup>
								<FormControlLabel
									disabled={formik.isSubmitting}
									control={
										<Checkbox
											name="removeTrackers"
											id="removeTrackers"
											checked={formik.values.removeTrackers}
											onChange={formik.handleChange}
											onBlur={formik.handleBlur}
										/>
									}
									labelPlacement="start"
									label={t("relations.alias.settings.removeTrackers.label")}
								/>
								<FormHelperText
									error={Boolean(
										formik.touched.createMailReport &&
											formik.errors.createMailReport,
									)}
								>
									{(formik.touched.createMailReport &&
										formik.errors.createMailReport) ||
										t("relations.alias.settings.removeTrackers.helperText")}
								</FormHelperText>
							</FormGroup>
						</Grid>
						<Grid item md={6} xs={12}>
							<FormGroup>
								<FormControlLabel
									disabled={formik.isSubmitting}
									control={
										<Checkbox
											name="createMailReport"
											id="createMailReport"
											checked={formik.values.createMailReport}
											onChange={formik.handleChange}
											onBlur={formik.handleBlur}
										/>
									}
									labelPlacement="start"
									label={t("relations.alias.settings.createMailReports.label")}
								/>
								<FormHelperText
									error={Boolean(
										formik.touched.createMailReport &&
											formik.errors.createMailReport,
									)}
								>
									{(formik.touched.createMailReport &&
										formik.errors.createMailReport) ||
										t("relations.alias.settings.createMailReports.helperText")}
								</FormHelperText>
							</FormGroup>
						</Grid>
						<Grid item xs={12}>
							<FormGroup>
								<FormControlLabel
									disabled={formik.isSubmitting}
									control={
										<Checkbox
											name="proxyImages"
											id="proxyImages"
											checked={formik.values.proxyImages}
											onChange={formik.handleChange}
											onBlur={formik.handleBlur}
										/>
									}
									labelPlacement="start"
									label={t("relations.alias.settings.proxyImages.label")}
								/>
								<FormHelperText
									error={Boolean(
										formik.touched.proxyImages && formik.errors.proxyImages,
									)}
								>
									{(formik.touched.proxyImages && formik.errors.proxyImages) ||
										t("relations.alias.settings.proxyImages.helperText")}
								</FormHelperText>
								<Alert
									sx={{width: "fit-content", alignSelf: "end", marginTop: 1}}
									severity="warning"
								>
									{t("general.experimentalFeature")}
								</Alert>
							</FormGroup>
							<Collapse in={formik.values.proxyImages}>
								<Grid
									display="flex"
									flexDirection={isLarge ? "row" : "column"}
									container
									marginY={2}
									spacing={4}
									alignItems={isLarge ? "flex-start" : "flex-end"}
								>
									<Grid item md={6} xs={12}>
										<FormGroup>
											<TextField
												fullWidth
												select
												InputProps={{
													startAdornment: (
														<InputAdornment position="start">
															<MdImage />
														</InputAdornment>
													),
												}}
												name="imageProxyFormat"
												id="imageProxyFormat"
												label={t(
													"relations.alias.settings.imageProxyFormat.label",
												)}
												value={formik.values.imageProxyFormat}
												onChange={formik.handleChange}
												disabled={formik.isSubmitting}
												error={
													formik.touched.imageProxyFormat &&
													Boolean(formik.errors.imageProxyFormat)
												}
												helperText={
													formik.touched.imageProxyFormat &&
													formik.errors.imageProxyFormat
												}
											>
												{Object.entries(
													IMAGE_PROXY_FORMAT_TYPE_NAME_MAP,
												).map(([value, translationString]) => (
													<MenuItem key={value} value={value}>
														{t(translationString)}
													</MenuItem>
												))}
											</TextField>
											<FormHelperText
												error={Boolean(
													formik.touched.imageProxyFormat &&
														formik.errors.imageProxyFormat,
												)}
											>
												{formik.touched.imageProxyFormat &&
													formik.errors.imageProxyFormat}
											</FormHelperText>
										</FormGroup>
									</Grid>
								</Grid>
							</Collapse>
						</Grid>
						<Grid item xs={12}>
							<FormGroup>
								<TextField
									fullWidth
									select
									name="proxyUserAgent"
									id="proxyUserAgent"
									label={t("relations.alias.settings.proxyUserAgent.label")}
									value={formik.values.proxyUserAgent}
									onChange={formik.handleChange}
									disabled={formik.isSubmitting}
									error={
										formik.touched.proxyUserAgent &&
										Boolean(formik.errors.proxyUserAgent)
									}
									helperText={
										formik.touched.proxyUserAgent &&
										formik.errors.proxyUserAgent
									}
								>
									{Object.entries(PROXY_USER_AGENT_TYPE_NAME_MAP).map(
										([value, translationString]) => (
											<MenuItem key={value} value={value}>
												{t(translationString)}
											</MenuItem>
										),
									)}
								</TextField>
								<FormHelperText
									error={Boolean(
										formik.touched.proxyUserAgent &&
											formik.errors.proxyUserAgent,
									)}
								>
									{(formik.touched.proxyUserAgent &&
										formik.errors.proxyUserAgent) ||
										t("relations.alias.settings.proxyUserAgent.helperText")}
								</FormHelperText>
							</FormGroup>
						</Grid>
						<Grid item xs={12}>
							<FormGroup>
								<FormControlLabel
									disabled={formik.isSubmitting}
									control={
										<Checkbox
											name="expandUrlShorteners"
											id="expandUrlShorteners"
											checked={formik.values.expandUrlShorteners}
											onChange={formik.handleChange}
											onBlur={formik.handleBlur}
										/>
									}
									labelPlacement="start"
									label={t("relations.alias.settings.expandUrlShorteners.label")}
								/>
								<FormHelperText
									error={Boolean(
										formik.touched.expandUrlShorteners &&
											formik.errors.expandUrlShorteners,
									)}
								>
									{(formik.touched.expandUrlShorteners &&
										formik.errors.expandUrlShorteners) ||
										t(
											"relations.alias.settings.expandUrlShorteners.helperText",
										)}
								</FormHelperText>
								<Alert
									sx={{width: "fit-content", alignSelf: "end", marginTop: 1}}
									severity="warning"
								>
									{t("general.experimentalFeature")}
								</Alert>
							</FormGroup>
						</Grid>
					</Grid>
				</Grid>
				<Grid item>
					<LoadingButton
						loading={formik.isSubmitting}
						variant="contained"
						type="submit"
						startIcon={<MdCheckCircle />}
					>
						{t("routes.SettingsRoute.forms.aliasPreferences.saveAction")}
					</LoadingButton>
				</Grid>
			</Grid>
		</form>
	)
}
