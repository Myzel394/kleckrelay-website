import * as yup from "yup"
import {ReactElement, useContext} from "react"
import {BsArrowsAngleExpand, BsImage, BsShieldShaded} from "react-icons/bs"
import {useFormik} from "formik"
import {FaFile, FaHandPaper} from "react-icons/fa"
import {MdCheckCircle, MdTextSnippet} from "react-icons/md"
import {AxiosError} from "axios"
import {useTranslation} from "react-i18next"

import {LoadingButton} from "@mui/lab"
import {Box, Collapse, Grid, Typography} from "@mui/material"
import {QueryKey, useMutation} from "@tanstack/react-query"

import {Alias, DecryptedAlias, ImageProxyFormatType, ProxyUserAgentType} from "~/server-types"
import {UpdateAliasData, updateAlias} from "~/apis"
import {createEnumMapFromTranslation, parseFastAPIError} from "~/utils"
import {useErrorSuccessSnacks} from "~/hooks"
import {queryClient} from "~/constants/react-query"
import {AuthContext, FormikAutoLockNavigation} from "~/components"
import SelectField from "~/route-widgets/AliasDetailRoute/SelectField"
import decryptAliasNotes from "~/apis/helpers/decrypt-alias-notes"

export interface AliasPreferencesFormProps {
	alias: Alias | DecryptedAlias

	queryKey: QueryKey
}

interface Form {
	removeTrackers: boolean | null
	createMailReport: boolean | null
	proxyImages: boolean | null
	imageProxyFormat: ImageProxyFormatType | null
	proxyUserAgent: ProxyUserAgentType | null
	expandUrlShorteners: boolean | null
	rejectOnPrivacyLeak: boolean | null

	detail?: string
}

export default function AliasPreferencesForm({
	alias,
	queryKey,
}: AliasPreferencesFormProps): ReactElement {
	const {t} = useTranslation(["aliases", "common"])
	const {showSuccess, showError} = useErrorSuccessSnacks()
	const {_decryptUsingMasterPassword} = useContext(AuthContext)

	const imageProxyMap = createEnumMapFromTranslation(
		"settings.fields.imageProxyFormat.values",
		ImageProxyFormatType,
	)(key => t(key))
	const imageProxyUserAgentMap = createEnumMapFromTranslation(
		"settings.fields.proxyUserAgent.values",
		ProxyUserAgentType,
	)(key => t(key))

	const schema = yup.object().shape({
		removeTrackers: yup
			.mixed<boolean | null>()
			.oneOf([true, false, null])
			.label(t("settings.fields.removeTrackers.label")),
		createMailReport: yup
			.mixed<boolean | null>()
			.oneOf([true, false, null])
			.label(t("settings.fields.createMailReport.label")),
		proxyImages: yup
			.mixed<boolean | null>()
			.oneOf([true, false, null])
			.label(t("settings.fields.proxyImages.label")),
		imageProxyFormat: yup
			.mixed<ImageProxyFormatType>()
			.oneOf([null, ...Object.values(ImageProxyFormatType)])
			.label(t("settings.fields.imageProxyFormat.label")),
		proxyUserAgent: yup
			.mixed<ProxyUserAgentType>()
			.oneOf([null, ...Object.values(ProxyUserAgentType)])
			.label(t("settings.fields.proxyUserAgent.label")),
		expandUrlShorteners: yup
			.mixed<boolean | null>()
			.oneOf([true, false, null])
			.label(t("settings.fields.expandUrlShorteners.label")),
		rejectOnPrivacyLeak: yup
			.mixed<boolean | null>()
			.oneOf([true, false, null])
			.label(t("settings.fields.rejectOnPrivacyLeak.label")),
	})

	const {mutateAsync} = useMutation<Alias, AxiosError, UpdateAliasData>(
		data => updateAlias(alias.id, data),
		{
			onSuccess: async newAlias => {
				showSuccess(t("messages.alias.updated", {ns: "common"}))
				;(newAlias as any as DecryptedAlias).notes = decryptAliasNotes(
					newAlias.encryptedNotes,
					_decryptUsingMasterPassword,
				)

				await queryClient.cancelQueries(queryKey)

				queryClient.setQueryData<DecryptedAlias>(
					queryKey,
					newAlias as any as DecryptedAlias,
				)
			},
			onError: showError,
		},
	)
	const formik = useFormik<Form>({
		enableReinitialize: true,
		initialValues: {
			removeTrackers: alias.prefRemoveTrackers,
			createMailReport: alias.prefCreateMailReport,
			proxyImages: alias.prefProxyImages,
			imageProxyFormat: alias.prefImageProxyFormat,
			proxyUserAgent: alias.prefProxyUserAgent,
			expandUrlShorteners: alias.prefExpandUrlShorteners,
			rejectOnPrivacyLeak: alias.prefRejectOnPrivacyLeak,
		},
		validationSchema: schema,
		onSubmit: async (values, {setErrors}) => {
			try {
				await mutateAsync({
					prefCreateMailReport: values.createMailReport,
					prefRemoveTrackers: values.removeTrackers,
					prefProxyImages: values.proxyImages,
					prefImagProxyFormat: values.imageProxyFormat,
					prefProxyUserAgent: values.proxyUserAgent,
					prefExpandUrlShorteners: values.expandUrlShorteners,
					prefRejectOnPrivacyLeak: values.rejectOnPrivacyLeak,
				})
			} catch (error) {
				setErrors(parseFastAPIError(error as AxiosError))
			}
		},
	})

	return (
		<>
			<form onSubmit={formik.handleSubmit}>
				<Box marginTop={1}>
					<Grid container spacing={4} flexDirection="column" alignItems="center">
						<Grid item>
							<Grid container spacing={4}>
								<Grid item xs={12} sm={6}>
									<SelectField
										label={t("settings.fields.removeTrackers.label")}
										formik={formik}
										icon={<BsShieldShaded />}
										name="removeTrackers"
									/>
								</Grid>
								<Grid item xs={12} sm={6}>
									<SelectField
										label={t("settings.fields.createMailReport.label")}
										formik={formik}
										icon={<MdTextSnippet />}
										name="createMailReport"
									/>
								</Grid>
								<Grid item xs={12}>
									<Grid container spacing={2}>
										<Grid item xs={12}>
											<SelectField
												label={t("settings.fields.proxyImages.label")}
												formik={formik}
												icon={<BsImage />}
												name="proxyImages"
											/>
										</Grid>
										<Grid item xs={12}>
											<Collapse in={formik.values.proxyImages !== false}>
												<Grid container spacing={4}>
													<Grid item xs={12} sm={6}>
														<SelectField
															label={t(
																"settings.fields.imageProxyFormat.label",
															)}
															formik={formik}
															icon={<FaFile />}
															name="imageProxyFormat"
															valueTextMap={imageProxyMap}
														/>
													</Grid>
													<Grid item xs={12} sm={6}>
														<SelectField
															label={t(
																"settings.fields.proxyUserAgent.label",
															)}
															formik={formik}
															name="proxyUserAgent"
															valueTextMap={imageProxyUserAgentMap}
														/>
													</Grid>
												</Grid>
											</Collapse>
										</Grid>
									</Grid>
								</Grid>
								<Grid item xs={12} sm={6}>
									<SelectField
										label={t("settings.fields.expandUrlShorteners.label")}
										formik={formik}
										icon={<BsArrowsAngleExpand />}
										name="expandUrlShorteners"
									/>
								</Grid>
								<Grid item xs={12} sm={6}>
									<SelectField
										label={t("settings.fields.rejectOnPrivacyLeak.label")}
										formik={formik}
										icon={<FaHandPaper />}
										name="rejectOnPrivacyLeak"
									/>
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
								{t("settings.continueActionLabel")}
							</LoadingButton>
						</Grid>
						<Grid item>
							<Typography variant="body2">{t("settings.description")}</Typography>
						</Grid>
					</Grid>
				</Box>
			</form>
			<FormikAutoLockNavigation formik={formik} />
		</>
	)
}
