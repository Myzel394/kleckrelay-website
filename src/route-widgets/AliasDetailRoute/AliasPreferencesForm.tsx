import * as yup from "yup"
import {ReactElement} from "react"
import {BsImage, BsShieldShaded} from "react-icons/bs"
import {useFormik} from "formik"
import {FaFile} from "react-icons/fa"

import {Collapse, Grid} from "@mui/material"
import {mdiTextBoxMultiple} from "@mdi/js/commonjs/mdi"
import Icon from "@mdi/react"

import {Alias, ImageProxyFormatType, ProxyUserAgentType} from "~/server-types"
import {LoadingButton} from "@mui/lab"
import {MdCheckCircle} from "react-icons/md"
import SelectField from "~/route-widgets/SettingsRoute/SelectField"

export interface AliasPreferencesFormProps {
	alias: Alias
}

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

export default function AliasPreferencesForm({
	alias,
}: AliasPreferencesFormProps): ReactElement {
	const formik = useFormik<Form>({
		initialValues: {
			removeTrackers: alias.prefRemoveTrackers,
			createMailReport: alias.prefCreateMailReport,
			proxyImages: alias.prefProxyImages,
			imageProxyFormat: alias.prefImageProxyFormat,
			imageProxyUserAgent: alias.prefImageProxyUserAgent,
		},
		validationSchema: SCHEMA,
		onSubmit: () => null,
	})

	return (
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
										in={formik.values.proxyImages !== false}
									>
										<Grid container spacing={4}>
											<Grid item xs={12} sm={6}>
												<SelectField
													label="Image File Type"
													formik={formik}
													icon={<FaFile />}
													name="imageProxyFormat"
												/>
											</Grid>
											<Grid item xs={12} sm={6}>
												<SelectField
													label="Image Proxy User Agent"
													formik={formik}
													name="imageProxyUserAgent"
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
	)
}
