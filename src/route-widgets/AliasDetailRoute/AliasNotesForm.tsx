import * as yup from "yup"
import {TiDelete} from "react-icons/ti"
import {AxiosError} from "axios"
import {ReactElement, useContext} from "react"
import {MdEditCalendar} from "react-icons/md"
import {RiLinkM, RiStickyNoteFill} from "react-icons/ri"
import {FieldArray, FormikProvider, useFormik} from "formik"
import format from "date-fns/format"
import update from "immutability-helper"

import {useMutation} from "@tanstack/react-query"
import {
	Button,
	FormGroup,
	FormHelperText,
	Grid,
	IconButton,
	InputAdornment,
	List,
	ListItem,
	ListItemIcon,
	ListItemSecondaryAction,
	ListItemText,
	TextField,
	Tooltip,
	Typography,
} from "@mui/material"

import {URL_REGEX} from "~/constants/values"
import {parseFastAPIError, whenEnterPressed} from "~/utils"
import {BackupImage, ErrorSnack, SuccessSnack} from "~/components"
import {Alias, AliasNote, DecryptedAlias} from "~/server-types"
import {UpdateAliasData, updateAlias} from "~/apis"
import AuthContext from "~/AuthContext/AuthContext"
import decryptAliasNotes from "~/apis/helpers/decrypt-alias-notes"

export interface AliasNotesFormProps {
	id: string
	notes: AliasNote

	onChanged: (alias: DecryptedAlias) => void
}

interface Form {
	personalNotes: string
	websites: AliasNote["data"]["websites"]

	detail?: string
}

interface WebsiteForm {
	url: string
}

const SCHEMA = yup.object().shape({
	personalNotes: yup.string(),
	websites: yup.array().of(
		yup.object().shape({
			url: yup.string().url(),
			createdAt: yup.date(),
		}),
	),
})
const WEBSITE_SCHEMA = yup.object().shape({
	url: yup.string().matches(URL_REGEX, "This URL is invalid."),
})

const getDomain = (url: string): string => {
	const {hostname, port} = new URL(url)
	return `${hostname}${port ? `:${port}` : ""}`
}

export default function AliasNotesForm({
	id,
	notes,
	onChanged,
}: AliasNotesFormProps): ReactElement {
	const {_encryptUsingMasterPassword, _decryptUsingMasterPassword} =
		useContext(AuthContext)
	const {mutateAsync, isSuccess} = useMutation<
		Alias,
		AxiosError,
		UpdateAliasData
	>(values => updateAlias(id, values), {
		onSuccess: newAlias => {
			;(newAlias as any as DecryptedAlias).notes = decryptAliasNotes(
				newAlias.encryptedNotes,
				_decryptUsingMasterPassword,
			)

			onChanged(newAlias as any as DecryptedAlias)
		},
	})
	const formik = useFormik<Form>({
		validationSchema: SCHEMA,
		initialValues: {
			personalNotes: notes.data.personalNotes,
			websites: notes.data.websites,
		},
		onSubmit: async (values, {setErrors}) => {
			try {
				const newNotes = update(notes, {
					data: {
						personalNotes: {
							$set: values.personalNotes,
						},
						websites: {
							$set: values.websites,
						},
					},
				})

				const data = _encryptUsingMasterPassword(
					JSON.stringify(newNotes),
				)
				await mutateAsync({
					encryptedNotes: data,
				})
			} catch (error) {
				setErrors(parseFastAPIError(error as AxiosError))
			}
		},
	})
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

			websiteFormik.resetForm()
			await formik.setFieldValue(
				"websites",
				[
					...formik.values.websites,
					{
						url: baseUrl,
						createdAt: new Date(),
					},
				],
				true,
			)
			await formik.submitForm()
		},
		validateOnChange: true,
		validateOnBlur: true,
	})

	return (
		<>
			<form onSubmit={formik.handleSubmit}>
				<Grid container spacing={4} direction="column">
					{notes.data.createdAt && (
						<Grid item>
							<Grid
								container
								spacing={1}
								flexDirection="row"
								alignItems="center"
							>
								<Grid item>
									<MdEditCalendar />
								</Grid>
								<Grid item>
									<Tooltip
										title={notes.data.createdAt.toISOString()}
									>
										<Typography variant="body1">
											{format(notes.data.createdAt, "Pp")}
										</Typography>
									</Tooltip>
								</Grid>
							</Grid>
						</Grid>
					)}
					<Grid item>
						<TextField
							label="Personal Notes"
							multiline
							fullWidth
							key="personalNotes"
							id="personalNotes"
							name="personalNotes"
							value={formik.values.personalNotes}
							onChange={formik.handleChange}
							onBlur={() => formik.submitForm()}
							disabled={formik.isSubmitting}
							error={
								formik.touched.personalNotes &&
								Boolean(formik.errors.personalNotes)
							}
							helperText={
								(formik.touched.personalNotes &&
									formik.errors.personalNotes) ||
								"You can enter personal notes for this alias here. Notes are encrypted."
							}
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<RiStickyNoteFill />
									</InputAdornment>
								),
							}}
						/>
					</Grid>
					<Grid item>
						<FormGroup row>
							<TextField
								name="url"
								id="url"
								label="Website"
								variant="outlined"
								value={websiteFormik.values.url}
								onChange={websiteFormik.handleChange}
								onBlur={websiteFormik.handleBlur}
								onKeyDown={whenEnterPressed(() =>
									websiteFormik.handleSubmit(),
								)}
								disabled={websiteFormik.isSubmitting}
								error={
									websiteFormik.touched.url &&
									Boolean(websiteFormik.errors.url)
								}
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
								onClick={() => websiteFormik.handleSubmit()}
							>
								Add
							</Button>
							<FormHelperText
								error={
									websiteFormik.touched.url &&
									Boolean(websiteFormik.errors.url)
								}
							>
								{(websiteFormik.touched.url &&
									websiteFormik.errors.url) ||
									"Add a website to this alias. Used to autofill."}
							</FormHelperText>
						</FormGroup>
						<FormikProvider value={formik}>
							<FieldArray
								name="websites"
								render={arrayHelpers => (
									<List>
										{formik.values.websites.map(
											(website, index) => (
												<ListItem key={website.url}>
													<ListItemIcon>
														<BackupImage
															width={20}
															fallbackSrc={`https://external-content.duckduckgo.com/ip3/${getDomain(
																website.url,
															)}.ico`}
															src={`${website.url}/favicon.ico`}
														/>
													</ListItemIcon>
													<ListItemText>
														{website.url}
													</ListItemText>
													<ListItemSecondaryAction>
														<IconButton
															edge="end"
															aria-label="delete"
															onClick={async () => {
																arrayHelpers.remove(
																	index,
																)
																await formik.submitForm()
															}}
														>
															<TiDelete />
														</IconButton>
													</ListItemSecondaryAction>
												</ListItem>
											),
										)}
									</List>
								)}
							/>
						</FormikProvider>
					</Grid>
				</Grid>
			</form>
			<ErrorSnack message={formik.errors.detail} />
			<SuccessSnack
				message={isSuccess && "Updated notes successfully!"}
			/>
		</>
	)
}
