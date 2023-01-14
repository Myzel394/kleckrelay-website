import * as yup from "yup"
import {useFormik} from "formik"
import {ReactElement} from "react"
import {RiLinkM} from "react-icons/ri"
import {useTranslation} from "react-i18next"

import {Button, FormGroup, FormHelperText, Grid, InputAdornment, TextField} from "@mui/material"

import {URL_REGEX} from "~/constants/values"
import {whenEnterPressed} from "~/utils"

export interface AddWebsiteFieldProps {
	onAdd: (website: string) => Promise<void>
	isLoading: boolean
}

interface WebsiteForm {
	url: string
}

const WEBSITE_SCHEMA = yup.object().shape({
	url: yup.string().matches(URL_REGEX, "This URL is invalid."),
})

export default function AddWebsiteField({onAdd, isLoading}: AddWebsiteFieldProps): ReactElement {
	const {t} = useTranslation()
	const websiteFormik = useFormik<WebsiteForm>({
		validationSchema: WEBSITE_SCHEMA,
		initialValues: {
			url: "",
		},
		onSubmit: async values => {
			const url = (() => {
				// Make sure url starts with `http://` or `https://`
				if (values.url.startsWith("http://")) {
					return values.url
				}
				if (values.url.startsWith("https://")) {
					return values.url
				}
				return `https://${values.url}`
			})()

			const {hostname, protocol, port} = new URL(url)
			const baseUrl = `${protocol}//${hostname}${port ? `:${port}` : ""}`

			await onAdd(baseUrl)
			websiteFormik.resetForm()
		},
		validateOnChange: true,
		validateOnBlur: true,
	})

	return (
		<Grid container direction="column">
			<Grid item>
				<FormGroup row>
					<TextField
						name="url"
						id="url"
						label={t("routes.AliasDetailRoute.sections.notes.form.websites.label")}
						placeholder={t(
							"routes.AliasDetailRoute.sections.notes.form.websites.placeholder",
						)}
						variant="outlined"
						value={websiteFormik.values.url}
						onChange={websiteFormik.handleChange}
						onBlur={websiteFormik.handleBlur}
						onKeyDown={whenEnterPressed(() => websiteFormik.handleSubmit())}
						disabled={websiteFormik.isSubmitting || isLoading}
						error={websiteFormik.touched.url && Boolean(websiteFormik.errors.url)}
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<RiLinkM />
								</InputAdornment>
							),
						}}
					/>
					<Button
						size="small"
						variant="contained"
						disableElevation
						disabled={websiteFormik.isSubmitting || isLoading}
						onClick={() => websiteFormik.handleSubmit()}
					>
						Add
					</Button>
				</FormGroup>
			</Grid>
			<Grid item>
				<FormHelperText
					error={websiteFormik.touched.url && Boolean(websiteFormik.errors.url)}
				>
					{(websiteFormik.touched.url && websiteFormik.errors.url) ||
						t("routes.AliasDetailRoute.sections.notes.form.websites.helperText")}
				</FormHelperText>
			</Grid>
		</Grid>
	)
}
