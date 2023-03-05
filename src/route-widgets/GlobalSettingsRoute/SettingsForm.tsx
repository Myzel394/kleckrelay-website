import * as yup from "yup"
import {useFormik} from "formik"
import {TbCursorText} from "react-icons/tb"
import {useTranslation} from "react-i18next"
import {MdCheck, MdClear, MdOutlineChangeCircle, MdTextFormat} from "react-icons/md"
import {BsImage} from "react-icons/bs"
import {AxiosError} from "axios"

import {FaMask} from "react-icons/fa"
import AliasesPercentageAmount from "./AliasPercentageAmount"

import {
	Checkbox,
	Collapse,
	FormControlLabel,
	FormGroup,
	FormHelperText,
	Grid,
	InputAdornment,
	TextField,
	Typography,
} from "@mui/material"
import {LoadingButton} from "@mui/lab"
import {useMutation} from "@tanstack/react-query"

import {AdminSettings} from "~/server-types"
import {StringPoolField, createPool} from "~/components"
import {UpdateAdminSettingsResponse, updateAdminSettings} from "~/apis"
import {useErrorSuccessSnacks} from "~/hooks"
import {queryClient} from "~/constants/react-query"
import {parseFastAPIError} from "~/utils"
import {DEFAULT_ADMIN_SETTINGS} from "~/constants/admin-settings"
import RandomAliasGenerator from "~/route-widgets/GlobalSettingsRoute/RandomAliasGenerator"

export interface SettingsFormProps {
	settings: AdminSettings
	queryKey: readonly string[]
}

const DEFAULT_POOLS = createPool({
	abcdefghijklmnopqrstuvwxyz: "a-z",
	ABCDEFGHIJKLMNOPQRSTUVWXYZ: "A-Z",
	"0123456789": "0-9",
})

export default function SettingsForm({settings, queryKey}: SettingsFormProps) {
	const {t} = useTranslation(["admin-global-settings", "common"])
	const {showSuccess, showError} = useErrorSuccessSnacks()

	const validationSchema = yup.object().shape({
		randomEmailIdMinLength: yup
			.number()
			.min(1)
			.max(1_023)
			.label(t("fields.randomEmailIdMinLength.label")),
		randomEmailIdChars: yup.string().label(t("fields.randomEmailIdChars.label")),
		randomEmailLengthIncreaseOnPercentage: yup
			.number()
			.min(0)
			.max(1)
			.label(t("fields.randomEmailLengthIncreaseOnPercentage.label")),
		imageProxyStorageLifeTimeInHours: yup
			.number()
			.label(t("fields.imageProxyStorageLifeTimeInHours.label")),
		customEmailSuffixLength: yup
			.number()
			.min(1)
			.max(1_023)
			.label(t("fields.customEmailSuffixLength.label")),
		customEmailSuffixChars: yup.string().label(t("fields.customEmailSuffixChars.label")),
		userEmailEnableDisposableEmails: yup
			.boolean()
			.label(t("fields.userEmailEnableDisposableEmails.label")),
		userEmailEnableOtherRelays: yup
			.boolean()
			.label(t("fields.userEmailEnableOtherRelays.label")),
		enableImageProxy: yup.boolean().label(t("fields.enableImageProxy.label")),
		enableImageProxyStorage: yup.boolean().label(t("fields.enableImageProxyStorage.label")),
		allowStatistics: yup.boolean().label(t("fields.allowStatistics.label")),
		allowAliasDeletion: yup.boolean().label(t("fields.allowAliasDeletion.label")),
		maxAliasesPerUser: yup.number().label(t("fields.maxAliasesPerUser.label")).min(0),
	} as Record<keyof AdminSettings, any>)

	const {mutateAsync} = useMutation<
		UpdateAdminSettingsResponse,
		AxiosError,
		Partial<AdminSettings>
	>(async settings => updateAdminSettings(settings), {
		onError: showError,
		onSuccess: ({code, detail, ...newSettings}) => {
			if (code === "error:settings:global_settings_disabled") {
				return
			}

			showSuccess(t("updatedSuccessfullyMessage"))

			queryClient.setQueryData<Partial<AdminSettings>>(queryKey, newSettings)
		},
	})

	const formik = useFormik<AdminSettings & {detail?: string}>({
		validationSchema,
		onSubmit: async (values, {setErrors}) => {
			try {
				await mutateAsync(values)
			} catch (error) {
				setErrors(parseFastAPIError(error as AxiosError))
			}
		},
		initialValues: settings,
	})

	// Fields will either have a value or be filled from the default values.
	// That means we will never have a `null` value.
	return (
		<form onSubmit={formik.handleSubmit}>
			<Grid
				container
				spacing={4}
				paddingX={2}
				paddingY={4}
				direction="column"
				alignItems="center"
				justifyContent="center"
			>
				<Grid item>
					<Grid container spacing={2} direction="column">
						<Grid item>
							<Typography variant="h4" component="h1" align="center">
								{t("title")}
							</Typography>
						</Grid>
						<Grid item>
							<Typography variant="subtitle1" component="p">
								{t("description")}
							</Typography>
						</Grid>
					</Grid>
				</Grid>
				<Grid item>
					<Grid container spacing={3} direction="row" alignItems="start">
						<Grid item xs={12}>
							<TextField
								key="max_aliases_per_user"
								fullWidth
								label={t("fields.maxAliasesPerUser.label")}
								name="maxAliasesPerUser"
								value={formik.values.maxAliasesPerUser}
								onChange={formik.handleChange}
								error={
									formik.touched.maxAliasesPerUser &&
									Boolean(formik.errors.maxAliasesPerUser)
								}
								helperText={
									(formik.touched.maxAliasesPerUser &&
										formik.errors.maxAliasesPerUser) ||
									t("fields.maxAliasesPerUser.description")
								}
								type="number"
								disabled={formik.isSubmitting}
								inputMode="numeric"
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<FaMask />
										</InputAdornment>
									),
								}}
							/>
						</Grid>
						<Grid item xs={12} md={6}>
							<TextField
								key="random_email_id_min_length"
								fullWidth
								label={t("fields.randomEmailIdMinLength.label")}
								name="randomEmailIdMinLength"
								value={formik.values.randomEmailIdMinLength}
								onChange={formik.handleChange}
								error={
									formik.touched.randomEmailIdMinLength &&
									Boolean(formik.errors.randomEmailIdMinLength)
								}
								helperText={
									(formik.touched.randomEmailIdMinLength &&
										formik.errors.randomEmailIdMinLength) ||
									t("fields.randomEmailIdMinLength.description")
								}
								type="number"
								disabled={formik.isSubmitting}
								inputMode="numeric"
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<TbCursorText />
										</InputAdornment>
									),
								}}
							/>
						</Grid>
						<Grid item xs={12} md={6}>
							<StringPoolField
								fullWidth
								allowCustom
								key="random_email_id_chars"
								pools={DEFAULT_POOLS}
								id="random_email_id_chars"
								label={t("fields.randomEmailIdChars.label")}
								name="randomEmailIdChars"
								value={formik.values.randomEmailIdChars!}
								onChange={formik.handleChange}
								error={
									formik.touched.randomEmailIdChars &&
									Boolean(formik.errors.randomEmailIdChars)
								}
								helperText={
									(formik.touched.randomEmailIdChars &&
										formik.errors.randomEmailIdChars) ||
									(t("fields.randomEmailIdChars.description") as string)
								}
								disabled={formik.isSubmitting}
								startAdornment={
									<InputAdornment position="start">
										<MdTextFormat />
									</InputAdornment>
								}
							/>
						</Grid>
						<Grid item xs={12} marginX="auto">
							<RandomAliasGenerator
								characters={formik.values.randomEmailIdChars!}
								length={formik.values.randomEmailIdMinLength!}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								key="random_email_length_increase_on_percentage"
								fullWidth
								label={t("fields.randomEmailLengthIncreaseOnPercentage.label")}
								name="randomEmailLengthIncreaseOnPercentage"
								value={formik.values.randomEmailLengthIncreaseOnPercentage}
								onChange={formik.handleChange}
								error={
									formik.touched.randomEmailLengthIncreaseOnPercentage &&
									Boolean(formik.errors.randomEmailLengthIncreaseOnPercentage)
								}
								helperText={
									(formik.touched.randomEmailLengthIncreaseOnPercentage &&
										formik.errors.randomEmailLengthIncreaseOnPercentage) ||
									t("fields.randomEmailLengthIncreaseOnPercentage.description")
								}
								type="number"
								disabled={formik.isSubmitting}
								inputMode="numeric"
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<MdOutlineChangeCircle />
										</InputAdornment>
									),
								}}
							/>
						</Grid>
						<Grid item xs={12}>
							<AliasesPercentageAmount
								percentage={formik.values.randomEmailLengthIncreaseOnPercentage!}
								length={formik.values.randomEmailIdMinLength!}
								characters={formik.values.randomEmailIdChars!}
							/>
						</Grid>
						<Grid item xs={12} md={6}>
							<TextField
								key="custom_email_suffix_length"
								fullWidth
								label={t("fields.customEmailSuffixLength.label")}
								name="customEmailSuffixLength"
								value={formik.values.customEmailSuffixLength}
								onChange={formik.handleChange}
								error={
									formik.touched.customEmailSuffixLength &&
									Boolean(formik.errors.customEmailSuffixLength)
								}
								helperText={
									(formik.touched.customEmailSuffixLength &&
										formik.errors.customEmailSuffixLength) ||
									t("fields.customEmailSuffixLength.description")
								}
								type="number"
								disabled={formik.isSubmitting}
								inputMode="numeric"
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<TbCursorText />
										</InputAdornment>
									),
								}}
							/>
						</Grid>
						<Grid item xs={12} md={6}>
							<StringPoolField
								key="custom_email_suffix_chars"
								allowCustom
								fullWidth
								pools={DEFAULT_POOLS}
								id="custom_email_suffix_chars"
								label={t("fields.customEmailSuffixChars.label")}
								name="customEmailSuffixChars"
								value={formik.values.customEmailSuffixChars!}
								onChange={formik.handleChange}
								error={
									formik.touched.customEmailSuffixChars &&
									Boolean(formik.errors.customEmailSuffixChars)
								}
								helperText={
									(formik.touched.customEmailSuffixChars &&
										formik.errors.customEmailSuffixChars) ||
									(t("fields.customEmailSuffixChars.description") as string)
								}
								disabled={formik.isSubmitting}
								startAdornment={
									<InputAdornment position="start">
										<MdTextFormat />
									</InputAdornment>
								}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								key="image_proxy_storage_life_time_in_hours"
								fullWidth
								label={t("fields.imageProxyStorageLifeTimeInHours.label")}
								name="imageProxyStorageLifeTimeInHours"
								value={formik.values.imageProxyStorageLifeTimeInHours}
								onChange={formik.handleChange}
								error={
									formik.touched.imageProxyStorageLifeTimeInHours &&
									Boolean(formik.errors.imageProxyStorageLifeTimeInHours)
								}
								helperText={
									(formik.touched.imageProxyStorageLifeTimeInHours &&
										formik.errors.imageProxyStorageLifeTimeInHours) ||
									t("fields.imageProxyStorageLifeTimeInHours.description")
								}
								type="number"
								disabled={formik.isSubmitting}
								inputMode="numeric"
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<BsImage />
										</InputAdornment>
									),
									endAdornment: (
										<InputAdornment position="end">
											{t("fields.imageProxyStorageLifeTimeInHours.unit", {
												count:
													formik.values
														.imageProxyStorageLifeTimeInHours || 0,
											})}
										</InputAdornment>
									),
								}}
							/>
						</Grid>
						<Grid item xs={12}>
							<FormGroup key="user_email_enable_disposable_emails">
								<FormControlLabel
									control={
										<Checkbox
											checked={formik.values.userEmailEnableDisposableEmails}
											onChange={formik.handleChange}
											name="userEmailEnableDisposableEmails"
										/>
									}
									disabled={formik.isSubmitting}
									label={t("fields.userEmailEnableDisposableEmails.label")}
								/>
								<FormHelperText
									error={
										formik.touched.userEmailEnableDisposableEmails &&
										Boolean(formik.errors.userEmailEnableDisposableEmails)
									}
								>
									{(formik.touched.userEmailEnableDisposableEmails &&
										formik.errors.userEmailEnableDisposableEmails) ||
										t("fields.userEmailEnableDisposableEmails.description")}
								</FormHelperText>
							</FormGroup>
						</Grid>
						<Grid item xs={12}>
							<FormGroup key="user_email_enable_other_relays">
								<FormControlLabel
									control={
										<Checkbox
											checked={formik.values.userEmailEnableOtherRelays}
											onChange={formik.handleChange}
											name="userEmailEnableOtherRelays"
										/>
									}
									disabled={formik.isSubmitting}
									label={t("fields.userEmailEnableOtherRelays.label")}
								/>
								<FormHelperText
									error={
										formik.touched.userEmailEnableOtherRelays &&
										Boolean(formik.errors.userEmailEnableOtherRelays)
									}
								>
									{(formik.touched.userEmailEnableOtherRelays &&
										formik.errors.userEmailEnableOtherRelays) ||
										t("fields.userEmailEnableOtherRelays.description")}
								</FormHelperText>
							</FormGroup>
						</Grid>
						<Grid item xs={12}>
							<Grid container spacing={1}>
								<Grid item>
									<FormGroup key="enable_image_proxy">
										<FormControlLabel
											control={
												<Checkbox
													checked={formik.values.enableImageProxy}
													onChange={formik.handleChange}
													name="enableImageProxy"
												/>
											}
											disabled={formik.isSubmitting}
											label={t("fields.enableImageProxy.label")}
										/>
										<FormHelperText
											error={
												formik.touched.enableImageProxy &&
												Boolean(formik.errors.enableImageProxy)
											}
										>
											{(formik.touched.enableImageProxy &&
												formik.errors.enableImageProxy) ||
												t("fields.enableImageProxy.description")}
										</FormHelperText>
									</FormGroup>
								</Grid>
								<Grid item>
									<Collapse in={formik.values.enableImageProxy}>
										<FormGroup key="enable_image_proxy_storage">
											<FormControlLabel
												control={
													<Checkbox
														checked={
															formik.values.enableImageProxyStorage
														}
														onChange={formik.handleChange}
														name="enableImageProxyStorage"
													/>
												}
												disabled={formik.isSubmitting}
												label={t("fields.enableImageProxyStorage.label")}
											/>
											<FormHelperText
												error={
													formik.touched.enableImageProxyStorage &&
													Boolean(formik.errors.enableImageProxyStorage)
												}
											>
												{(formik.touched.enableImageProxyStorage &&
													formik.errors.enableImageProxyStorage) ||
													t("fields.enableImageProxyStorage.description")}
											</FormHelperText>
										</FormGroup>
									</Collapse>
								</Grid>
							</Grid>
						</Grid>
						<Grid item xs={12}>
							<FormGroup key="allow_statistics">
								<FormControlLabel
									control={
										<Checkbox
											checked={formik.values.allowStatistics}
											onChange={formik.handleChange}
											name="allowStatistics"
										/>
									}
									disabled={formik.isSubmitting}
									label={t("fields.allowStatistics.label")}
								/>
								<FormHelperText
									error={
										formik.touched.allowStatistics &&
										Boolean(formik.errors.allowStatistics)
									}
								>
									{(formik.touched.allowStatistics &&
										formik.errors.allowStatistics) ||
										t("fields.allowStatistics.description")}
								</FormHelperText>
							</FormGroup>
						</Grid>
						<Grid item xs={12}>
							<FormGroup key="allow_alias_deletion">
								<FormControlLabel
									control={
										<Checkbox
											checked={formik.values.allowAliasDeletion}
											onChange={formik.handleChange}
											name="allowAliasDeletion"
										/>
									}
									disabled={formik.isSubmitting}
									label={t("fields.allowAliasDeletion.label")}
								/>
								<FormHelperText
									error={
										formik.touched.allowAliasDeletion &&
										Boolean(formik.errors.allowAliasDeletion)
									}
								>
									{(formik.touched.allowAliasDeletion &&
										formik.errors.allowAliasDeletion) ||
										t("fields.allowAliasDeletion.description")}
								</FormHelperText>
							</FormGroup>
						</Grid>
					</Grid>
				</Grid>
				<Grid item>
					<Grid container justifyContent="center" gap={2}>
						<Grid item>
							<LoadingButton
								loading={formik.isSubmitting}
								variant="outlined"
								type="reset"
								startIcon={<MdClear />}
								color="warning"
								onClick={() => {
									formik.setValues(DEFAULT_ADMIN_SETTINGS)
									formik.submitForm()
								}}
							>
								{t("general.resetLabel", {ns: "common"})}
							</LoadingButton>
						</Grid>
						<Grid item>
							<LoadingButton
								loading={formik.isSubmitting}
								variant="contained"
								type="submit"
								startIcon={<MdCheck />}
							>
								{t("general.saveLabel", {ns: "common"})}
							</LoadingButton>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</form>
	)
}
