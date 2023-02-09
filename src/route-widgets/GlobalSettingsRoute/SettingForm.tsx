import * as yup from "yup"
import {AdminSettings} from "~/server-types"
import {useTranslation} from "react-i18next"
import {useFormik} from "formik"
import {SimpleForm} from "~/components"
import {TextField} from "@mui/material"

export interface SettingsFormProps {
	settings: AdminSettings
}

export default function SettingsForm({settings}: SettingsFormProps) {
	const {t} = useTranslation()

	const validationSchema = yup.object().shape({
		randomEmailIdMinLength: yup
			.number()
			.min(1)
			.max(1_023)
			.label(t("routes.AdminRoute.forms.settings.randomEmailIdMinLength.label")),
		randomEmailIdChars: yup
			.string()
			.label(t("routes.AdminRoute.forms.settings.randomEmailIdChars.label")),
		randomEmailLengthIncreaseOnPercentage: yup
			.number()
			.label(
				t("routes.AdminRoute.forms.settings.randomEmailLengthIncreaseOnPercentage.label"),
			),
		imageProxyStorageLifeTimeInHours: yup
			.number()
			.label(t("routes.AdminRoute.forms.settings.imageProxyStorageLifeTimeInHours.label")),
		customEmailSuffixLength: yup
			.number()
			.min(1)
			.max(1_023)
			.label(t("routes.AdminRoute.forms.settings.customEmailSuffixLength-label")),
		customEmailSuffixChars: yup
			.string()
			.label(t("routes.AdminRoute.forms.settings.customEmailSuffixChars.label")),
		userEmailEnableDisposableEmails: yup
			.boolean()
			.label(t("routes.AdminRoute.forms.settings.userEmailEnableDisposableEmails.label")),
		userEmailEnableOtherRelays: yup
			.boolean()
			.label(t("routes.AdminRoute.forms.settings.userEmailEnableOtherRelays.label")),
		enableImageProxy: yup
			.boolean()
			.label(t("routes.AdminRoute.forms.settings.enableImageProxy.label")),
		allowStatistics: yup
			.boolean()
			.label(t("routes.AdminRoute.forms.settings.allowStatistics.label")),
	})

	const formik = useFormik<AdminSettings>({
		validationSchema,
		onSubmit: console.log,
		initialValues: settings,
	})

	return (
		<form onSubmit={formik.handleSubmit}>
			<SimpleForm
				isSubmitting={formik.isSubmitting}
				title={t("routes.AdminRoute.settings.title")}
				description={t("routes.AdminRoute.settings.description")}
				continueActionLabel={t("general.save")}
			>
				{[
					<TextField
						key="random_email_id_min_length"
						label={t("routes.AdminRoute.forms.settings.randomEmailIdMinLength.label")}
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
							t("routes.AdminRoute.forms.settings.randomEmailIdMinLength.description")
						}
						type="number"
						disabled={formik.isSubmitting}
						inputMode="numeric"
					/>,
				]}
			</SimpleForm>
		</form>
	)
}
