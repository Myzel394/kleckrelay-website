import * as yup from "yup"
import {AxiosError} from "axios"
import {useFormik} from "formik"
import {MdCheckCircle, MdImage} from "react-icons/md"
import React, {ReactElement, useContext} from "react"

import {useMutation} from "@tanstack/react-query"
import {
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

import {
	ImageProxyFormatType,
	ProxyUserAgentType,
	SimpleDetailResponse,
} from "~/server-types"
import {UpdatePreferencesData, updatePreferences} from "~/apis"
import {useUser} from "~/hooks"
import {parseFastAPIError} from "~/utils"
import {SuccessSnack} from "~/components"
import AuthContext from "~/AuthContext/AuthContext"
import ErrorSnack from "~/components/ErrorSnack"

interface Form {
	removeTrackers: boolean
	createMailReport: boolean
	proxyImages: boolean
	imageProxyFormat: ImageProxyFormatType
	imageProxyUserAgent: ProxyUserAgentType

	detail?: string
}

const SCHEMA = yup.object().shape({
	removeTrackers: yup.boolean(),
	createMailReport: yup.boolean(),
	proxyImages: yup.boolean(),
	imageProxyFormat: yup
		.mixed<ImageProxyFormatType>()
		.oneOf(Object.values(ImageProxyFormatType))
		.required(),
	imageProxyUserAgent: yup
		.mixed<ProxyUserAgentType>()
		.oneOf(Object.values(ProxyUserAgentType))
		.required(),
})

const IMAGE_PROXY_FORMAT_TYPE_NAME_MAP: Record<ImageProxyFormatType, string> = {
	[ImageProxyFormatType.JPEG]: "JPEG",
	[ImageProxyFormatType.PNG]: "PNG",
	[ImageProxyFormatType.WEBP]: "WebP",
}

const IMAGE_PROXY_USER_AGENT_TYPE_NAME_MAP: Record<ProxyUserAgentType, string> =
	{
		[ProxyUserAgentType.APPLE_MAIL]: "Apple Mail",
		[ProxyUserAgentType.GOOGLE_MAIL]: "Google Mail",
		[ProxyUserAgentType.CHROME]: "Chrome Browser",
		[ProxyUserAgentType.FIREFOX]: "Firefox Browser",
		[ProxyUserAgentType.OUTLOOK_MACOS]: "Outlook / MacOS",
		[ProxyUserAgentType.OUTLOOK_WINDOWS]: "Outlook / Windows",
	}

export default function AliasesPreferencesForm(): ReactElement {
	const {_updateUser} = useContext(AuthContext)
	const user = useUser()
	const {mutateAsync, data} = useMutation<
		SimpleDetailResponse,
		AxiosError,
		UpdatePreferencesData
	>(updatePreferences, {
		onSuccess: (_, values) => {
			const newUser = {
				...user,
				preferences: {
					...user.preferences,
					...values,
				},
			}

			_updateUser(newUser)
		},
	})
	const formik = useFormik<Form>({
		validationSchema: SCHEMA,
		initialValues: {
			removeTrackers: user.preferences.aliasRemoveTrackers,
			createMailReport: user.preferences.aliasCreateMailReport,
			proxyImages: user.preferences.aliasProxyImages,
			imageProxyFormat: user.preferences.aliasImageProxyFormat,
			imageProxyUserAgent: user.preferences.aliasImageProxyUserAgent,
		},
		onSubmit: async (values, {setErrors}) => {
			try {
				await mutateAsync({
					aliasRemoveTrackers: values.removeTrackers,
					aliasCreateMailReport: values.createMailReport,
					aliasProxyImages: values.proxyImages,
					aliasImageProxyFormat: values.imageProxyFormat,
					aliasImageProxyUserAgent: values.imageProxyUserAgent,
				})
			} catch (error) {
				setErrors(parseFastAPIError(error as AxiosError))
			}
		},
	})
	const theme = useTheme()
	const isLarge = useMediaQuery(theme.breakpoints.up("md"))

	return (
		<>
			<form onSubmit={formik.handleSubmit}>
				<Grid
					container
					spacing={4}
					flexDirection="column"
					alignItems="center"
				>
					<Grid item>
						<Typography variant="h6" component="h3">
							Aliases Preferences
						</Typography>
					</Grid>
					<Grid item>
						<Typography variant="body1" component="p">
							Select the default behavior for your aliases. This
							will only affect aliases that do not have a custom
							behavior set.
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
							<Grid item md={6}>
								<FormGroup>
									<FormControlLabel
										disabled={formik.isSubmitting}
										control={
											<Checkbox
												name="removeTrackers"
												id="removeTrackers"
												checked={
													formik.values.removeTrackers
												}
												onChange={formik.handleChange}
												onBlur={formik.handleBlur}
											/>
										}
										labelPlacement="start"
										label="Remove Trackers"
									/>
									<FormHelperText
										error={Boolean(
											formik.touched.createMailReport &&
												formik.errors.createMailReport,
										)}
									>
										{(formik.touched.createMailReport &&
											formik.errors.createMailReport) ||
											"Remove single-pixel image trackers as well as url trackers."}
									</FormHelperText>
								</FormGroup>
							</Grid>
							<Grid item md={6}>
								<FormGroup>
									<FormControlLabel
										disabled={formik.isSubmitting}
										control={
											<Checkbox
												name="createMailReport"
												id="createMailReport"
												checked={
													formik.values
														.createMailReport
												}
												onChange={formik.handleChange}
												onBlur={formik.handleBlur}
											/>
										}
										labelPlacement="start"
										label="Create Reports"
									/>
									<FormHelperText
										error={Boolean(
											formik.touched.createMailReport &&
												formik.errors.createMailReport,
										)}
									>
										{(formik.touched.createMailReport &&
											formik.errors.createMailReport) ||
											"Create reports of emails sent to aliases. Reports are end-to-end encrypted. Only you can access them."}
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
												checked={
													formik.values.proxyImages
												}
												onChange={formik.handleChange}
												onBlur={formik.handleBlur}
											/>
										}
										labelPlacement="start"
										label="Proxy Images"
									/>
									<FormHelperText
										error={Boolean(
											formik.touched.proxyImages &&
												formik.errors.proxyImages,
										)}
									>
										{(formik.touched.proxyImages &&
											formik.errors.proxyImages) ||
											"Proxies images in your emails through this KleckRelay instance. This adds an extra layer of privacy. Images are loaded immediately after we receive the email. They then will be stored for some time (cache time). During that time, the image will be served from us. This means the original server has no idea you have opened the mail. After the cache time, the image is loaded from the original server, but it gets proxied by us. This means the original server will not be able to access neither your IP address nor your user agent."}
									</FormHelperText>
								</FormGroup>
								<Collapse in={formik.values.proxyImages}>
									<Grid
										display="flex"
										flexDirection={
											isLarge ? "row" : "column"
										}
										container
										marginY={2}
										spacing={4}
										alignItems={
											isLarge ? "flex-start" : "flex-end"
										}
									>
										<Grid item md={6}>
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
													label="Image File Type"
													value={
														formik.values
															.imageProxyFormat
													}
													onChange={
														formik.handleChange
													}
													disabled={
														formik.isSubmitting
													}
													error={
														formik.touched
															.imageProxyFormat &&
														Boolean(
															formik.errors
																.imageProxyFormat,
														)
													}
													helperText={
														formik.touched
															.imageProxyFormat &&
														formik.errors
															.imageProxyFormat
													}
												>
													{Object.entries(
														ImageProxyFormatType,
													).map(([key, value]) => (
														<MenuItem
															key={key}
															value={value}
														>
															{
																IMAGE_PROXY_FORMAT_TYPE_NAME_MAP[
																	value
																] as string
															}
														</MenuItem>
													))}
												</TextField>
												<FormHelperText
													error={Boolean(
														formik.touched
															.imageProxyFormat &&
															formik.errors
																.imageProxyFormat,
													)}
												>
													{formik.touched
														.imageProxyFormat &&
														formik.errors
															.imageProxyFormat}
												</FormHelperText>
											</FormGroup>
										</Grid>
										<Grid item md={6}>
											<FormGroup>
												<TextField
													fullWidth
													select
													name="imageProxyUserAgent"
													id="imageProxyUserAgent"
													label="Image Proxy User Agent"
													value={
														formik.values
															.imageProxyUserAgent
													}
													onChange={
														formik.handleChange
													}
													disabled={
														formik.isSubmitting
													}
													error={
														formik.touched
															.imageProxyUserAgent &&
														Boolean(
															formik.errors
																.imageProxyUserAgent,
														)
													}
													helperText={
														formik.touched
															.imageProxyUserAgent &&
														formik.errors
															.imageProxyUserAgent
													}
												>
													{Object.entries(
														ProxyUserAgentType,
													).map(([key, value]) => (
														<MenuItem
															key={key}
															value={value}
														>
															{
																IMAGE_PROXY_USER_AGENT_TYPE_NAME_MAP[
																	value
																] as string
															}
														</MenuItem>
													))}
												</TextField>
												<FormHelperText
													error={Boolean(
														formik.touched
															.imageProxyUserAgent &&
															formik.errors
																.imageProxyUserAgent,
													)}
												>
													{(formik.touched
														.imageProxyUserAgent &&
														formik.errors
															.imageProxyUserAgent) ||
														"An User Agent is a identifier each browser and email client sends when retrieving files, such as images. You can specify here what user agent you would like to be used by the proxy. User Agents are kept up-to-date."}
												</FormHelperText>
											</FormGroup>
										</Grid>
									</Grid>
								</Collapse>
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
							Save Preferences
						</LoadingButton>
					</Grid>
				</Grid>
			</form>
			<ErrorSnack message={formik.errors.detail} />
			<SuccessSnack message={data?.detail} />
		</>
	)
}
