import * as yup from "yup"
import {ReactElement} from "react"
import {BsImage, BsShieldShaded} from "react-icons/bs"
import {useFormik} from "formik"
import {FaFile} from "react-icons/fa"
import {MdCheckCircle} from "react-icons/md"
import {AxiosError} from "axios"

import {LoadingButton} from "@mui/lab"
import {Collapse, Grid} from "@mui/material"
import {mdiTextBoxMultiple} from "@mdi/js/commonjs/mdi"
import {useMutation} from "@tanstack/react-query"
import Icon from "@mdi/react"

import {
	Alias,
	DecryptedAlias,
	ImageProxyFormatType,
	ProxyUserAgentType,
} from "~/server-types"
import {
	IMAGE_PROXY_FORMAT_TYPE_NAME_MAP,
	IMAGE_PROXY_USER_AGENT_TYPE_NAME_MAP,
} from "~/constants/enum_mappings"
import {UpdateAliasData, updateAlias} from "~/apis"
import {ErrorSnack, SuccessSnack} from "~/components"
import {parseFastAPIError} from "~/utils"
import FormikAutoLockNavigation from "~/LockNavigationContext/FormikAutoLockNavigation"
import SelectField from "~/route-widgets/SettingsRoute/SelectField"

export interface AliasPreferencesFormProps {
	alias: Alias | DecryptedAlias
}

interface Form {
	removeTrackers: boolean | null
	createMailReport: boolean | null
	proxyImages: boolean | null
	imageProxyFormat: ImageProxyFormatType | null
	imageProxyUserAgent: ProxyUserAgentType | null

	detail?: string
}

const SCHEMA = yup.object().shape({
	removeTrackers: yup.mixed<boolean | null>().oneOf([true, false, null]),
	createMailReport: yup.mixed<boolean | null>().oneOf([true, false, null]),
	proxyImages: yup.mixed<boolean | null>().oneOf([true, false, null]),
	imageProxyFormat: yup
		.mixed<ImageProxyFormatType>()
		.oneOf([null, ...Object.values(ImageProxyFormatType)]),
	imageProxyUserAgent: yup
		.mixed<ProxyUserAgentType>()
		.oneOf([null, ...Object.values(ProxyUserAgentType)]),
})

export default function AliasPreferencesForm({
	alias,
}: AliasPreferencesFormProps): ReactElement {
	const {mutateAsync, isSuccess} = useMutation<
		Alias,
		AxiosError,
		UpdateAliasData
	>(data => updateAlias(alias.id, data))
	const formik = useFormik<Form>({
		enableReinitialize: true,
		initialValues: {
			removeTrackers: alias.prefRemoveTrackers,
			createMailReport: alias.prefCreateMailReport,
			proxyImages: alias.prefProxyImages,
			imageProxyFormat: alias.prefImageProxyFormat,
			imageProxyUserAgent: alias.prefImageProxyUserAgent,
		},
		validationSchema: SCHEMA,
		onSubmit: async (values, {setErrors}) => {
			try {
				await mutateAsync({
					prefCreateMailReport: values.createMailReport,
					prefRemoveTrackers: values.removeTrackers,
					prefProxyImages: values.proxyImages,
					prefImagProxyFormat: values.imageProxyFormat,
					prefImageProxyUserAgent: values.imageProxyUserAgent,
				})
			} catch (error) {
				setErrors(parseFastAPIError(error as AxiosError))
			}
		},
	})

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
						<Grid container spacing={4}>
							<Grid item xs={12} sm={6}>
								<SelectField
									label="Remove Trackers"
									formik={formik}
									icon={<BsShieldShaded />}
									name="removeTrackers"
								/>
							</Grid>
							<Grid item xs={12} sm={6}>
								<SelectField
									label="Create Reports"
									formik={formik}
									icon={
										<Icon
											path={mdiTextBoxMultiple}
											size={0.8}
										/>
									}
									name="createMailReport"
								/>
							</Grid>
							<Grid item xs={12}>
								<Grid container spacing={2}>
									<Grid item xs={12}>
										<SelectField
											label="Proxy Images"
											formik={formik}
											icon={<BsImage />}
											name="proxyImages"
										/>
									</Grid>
									<Grid item xs={12}>
										<Collapse
											in={
												formik.values.proxyImages !==
												false
											}
										>
											<Grid container spacing={4}>
												<Grid item xs={12} sm={6}>
													<SelectField
														label="Image File Type"
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
														label="Image Proxy User Agent"
														formik={formik}
														name="imageProxyUserAgent"
														valueTextMap={
															IMAGE_PROXY_USER_AGENT_TYPE_NAME_MAP
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
							Save Settings
						</LoadingButton>
					</Grid>
				</Grid>
			</form>
			<FormikAutoLockNavigation formik={formik} />
			<ErrorSnack message={formik.errors.detail} />
			<SuccessSnack
				message={isSuccess && "Updated Alias successfully!"}
			/>
		</>
	)
}
