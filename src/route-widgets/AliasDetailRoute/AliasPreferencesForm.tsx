import * as yup from "yup"
import {ReactElement, useContext} from "react"
import {BsImage, BsShieldShaded} from "react-icons/bs"
import {useFormik} from "formik"
import {FaFile} from "react-icons/fa"
import {MdCheckCircle} from "react-icons/md"
import {AxiosError} from "axios"
import {useTranslation} from "react-i18next"

import {LoadingButton} from "@mui/lab"
import {Box, Collapse, Grid, Typography} from "@mui/material"
import {mdiTextBoxMultiple} from "@mdi/js/commonjs/mdi"
import {QueryKey, useMutation} from "@tanstack/react-query"
import Icon from "@mdi/react"

import {Alias, DecryptedAlias, ImageProxyFormatType, ProxyUserAgentType} from "~/server-types"
import {UpdateAliasData, updateAlias} from "~/apis"
import {parseFastAPIError} from "~/utils"
import {
	IMAGE_PROXY_FORMAT_TYPE_NAME_MAP,
	PROXY_USER_AGENT_TYPE_NAME_MAP,
} from "~/constants/enum-mappings"
import {useErrorSuccessSnacks} from "~/hooks"
import {queryClient} from "~/constants/react-query"
import AuthContext from "~/AuthContext/AuthContext"
import FormikAutoLockNavigation from "~/LockNavigationContext/FormikAutoLockNavigation"
import SelectField from "~/route-widgets/SettingsRoute/SelectField"
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

	detail?: string
}

export default function AliasPreferencesForm({
	alias,
	queryKey,
}: AliasPreferencesFormProps): ReactElement {
	const {t} = useTranslation()
	const {showSuccess, showError} = useErrorSuccessSnacks()
	const {_decryptUsingMasterPassword} = useContext(AuthContext)

	const schema = yup.object().shape({
		removeTrackers: yup
			.mixed<boolean | null>()
			.oneOf([true, false, null])
			.label(t("relations.alias.settings.removeTrackers.label")),
		createMailReport: yup
			.mixed<boolean | null>()
			.oneOf([true, false, null])
			.label(t("relations.alias.settings.createMailReport.label")),
		proxyImages: yup.mixed<boolean | null>().oneOf([true, false, null]),
		imageProxyFormat: yup
			.mixed<ImageProxyFormatType>()
			.oneOf([null, ...Object.values(ImageProxyFormatType)])
			.label(t("relations.alias.settings.imageProxyFormat.label")),
		proxyUserAgent: yup
			.mixed<ProxyUserAgentType>()
			.oneOf([null, ...Object.values(ProxyUserAgentType)])
			.label(t("relations.alias.settings.proxyUserAgent.label")),
		expandUrlShorteners: yup
			.mixed<boolean | null>()
			.oneOf([true, false, null])
			.label(t("relations.alias.settings.expandUrlShorteners.label")),
	})

	const {mutateAsync} = useMutation<Alias, AxiosError, UpdateAliasData>(
		data => updateAlias(alias.id, data),
		{
			onSuccess: async newAlias => {
				showSuccess(t("relations.alias.mutations.success.aliasUpdated"))
				;(newAlias as any as DecryptedAlias).notes = decryptAliasNotes(
					newAlias.encryptedNotes,
					_decryptUsingMasterPassword,
				)

				await queryClient.cancelQueries(queryKey)

				queryClient.setQueryData<DecryptedAlias | Alias>(queryKey, newAlias)
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
										label={t("relations.alias.settings.removeTrackers.label")}
										formik={formik}
										icon={<BsShieldShaded />}
										name="removeTrackers"
									/>
								</Grid>
								<Grid item xs={12} sm={6}>
									<SelectField
										label={t(
											"relations.alias.settings.createMailReports.label",
										)}
										formik={formik}
										icon={<Icon path={mdiTextBoxMultiple} size={0.8} />}
										name="createMailReport"
									/>
								</Grid>
								<Grid item xs={12}>
									<Grid container spacing={2}>
										<Grid item xs={12}>
											<SelectField
												label={t(
													"relations.alias.settings.proxyImages.label",
												)}
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
																"relations.alias.settings.imageProxyFormat.label",
															)}
															formik={formik}
															icon={<FaFile />}
															name="imageProxyFormat"
															valueTextMap={
																IMAGE_PROXY_FORMAT_TYPE_NAME_MAP
															}
														/>
													</Grid>
													<Grid item xs={12} sm={6}>
														<SelectField
															label={t(
																"relations.alias.settings.proxyUserAgent.label",
															)}
															formik={formik}
															name="proxyUserAgent"
															valueTextMap={
																PROXY_USER_AGENT_TYPE_NAME_MAP
															}
														/>
													</Grid>
												</Grid>
											</Collapse>
										</Grid>
									</Grid>
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
								{t("relations.alias.settings.saveAction")}
							</LoadingButton>
						</Grid>
						<Grid item>
							<Typography variant="body2">
								{t("routes.AliasDetailRoute.sections.settings.description")}
							</Typography>
						</Grid>
					</Grid>
				</Box>
			</form>
			<FormikAutoLockNavigation formik={formik} />
		</>
	)
}
