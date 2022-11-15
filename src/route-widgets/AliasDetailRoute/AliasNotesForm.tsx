import * as yup from "yup"
import {TiDelete} from "react-icons/ti"
import {AxiosError} from "axios"
import {ReactElement, useContext, useMemo, useState} from "react"
import {MdCheckCircle, MdEditCalendar} from "react-icons/md"
import {RiStickyNoteFill} from "react-icons/ri"
import {FieldArray, FormikProvider, useFormik} from "formik"
import {FaPen} from "react-icons/fa"
import {useTranslation} from "react-i18next"
import deepEqual from "deep-equal"
import format from "date-fns/format"
import update from "immutability-helper"

import {QueryKey, useMutation} from "@tanstack/react-query"
import {
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

import {parseFastAPIError} from "~/utils"
import {FaviconImage, SimpleOverlayInformation} from "~/components"
import {Alias, AliasNote, DecryptedAlias} from "~/server-types"
import {UpdateAliasData, updateAlias} from "~/apis"
import {useErrorSuccessSnacks} from "~/hooks"
import {queryClient} from "~/constants/react-query"
import AddWebsiteField from "~/route-widgets/AliasDetailRoute/AddWebsiteField"
import AuthContext from "~/AuthContext/AuthContext"
import FormikAutoLockNavigation from "~/LockNavigationContext/FormikAutoLockNavigation"
import decryptAliasNotes from "~/apis/helpers/decrypt-alias-notes"

export interface AliasNotesFormProps {
	id: string
	notes: AliasNote

	queryKey: QueryKey
}

interface Form {
	personalNotes: string
	websites: AliasNote["data"]["websites"]

	detail?: string
}

export default function AliasNotesForm({id, notes, queryKey}: AliasNotesFormProps): ReactElement {
	const {t} = useTranslation()
	const {showError, showSuccess} = useErrorSuccessSnacks()
	const {_encryptUsingMasterPassword, _decryptUsingMasterPassword} = useContext(AuthContext)

	const schema = yup.object().shape({
		personalNotes: yup
			.string()
			.label(t("routes.AliasDetailRoute.sections.notes.form.personalNotes.label")),
		websites: yup.array().of(
			yup
				.object()
				.shape({
					url: yup.string().url(),
				})
				.label(t("routes.AliasDetailRoute.sections.notes.form.websites.label")),
		),
	})

	const {mutateAsync} = useMutation<Alias, AxiosError, UpdateAliasData>(
		values => updateAlias(id, values),
		{
			onSuccess: async newAlias => {
				;(newAlias as any as DecryptedAlias).notes = decryptAliasNotes(
					newAlias.encryptedNotes,
					_decryptUsingMasterPassword,
				)

				showSuccess(t("relations.alias.mutations.success.notesUpdated"))

				await queryClient.cancelQueries(queryKey)

				queryClient.setQueryData<DecryptedAlias | Alias>(queryKey, newAlias)
			},
			onError: showError,
		},
	)
	const initialValues = useMemo(
		() => ({
			personalNotes: notes.data.personalNotes,
			websites: notes.data.websites,
		}),
		[notes.data.personalNotes, notes.data.websites],
	)
	const formik = useFormik<Form>({
		validationSchema: schema,
		initialValues,
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

				const data = _encryptUsingMasterPassword(JSON.stringify(newNotes))
				await mutateAsync({
					encryptedNotes: data,
				})
			} catch (error) {
				setErrors(parseFastAPIError(error as AxiosError))
			}
		},
	})

	const [isInEditMode, setIsInEditMode] = useState<boolean>(false)

	return (
		<>
			<form onSubmit={formik.handleSubmit}>
				<Grid container direction="column" spacing={1}>
					<Grid item>
						<Grid container spacing={1} direction="row">
							<Grid item>
								<Typography variant="h6" component="h3">
									{t("routes.AliasDetailRoute.sections.notes.title")}
								</Typography>
							</Grid>
							<Grid item>
								<IconButton
									size="small"
									disabled={formik.isSubmitting}
									onClick={async () => {
										if (
											isInEditMode &&
											!deepEqual(initialValues, formik.values, {
												strict: true,
											})
										) {
											await formik.submitForm()
										}

										setIsInEditMode(!isInEditMode)
									}}
								>
									{isInEditMode ? <MdCheckCircle /> : <FaPen />}
								</IconButton>
							</Grid>
						</Grid>
					</Grid>
					<Grid item>
						<Grid container spacing={2} direction="column">
							{notes.data.createdAt && (
								<Grid item>
									<SimpleOverlayInformation
										emptyText={t("general.emptyUnavailableValue")}
										icon={<MdEditCalendar />}
										label={t(
											"routes.AliasDetailRoute.sections.notes.form.createdAt.label",
										)}
									>
										{notes.data.createdAt && (
											<Tooltip title={notes.data.createdAt.toISOString()}>
												<Typography variant="body1">
													{format(notes.data.createdAt, "Pp")}
												</Typography>
											</Tooltip>
										)}
									</SimpleOverlayInformation>
								</Grid>
							)}
							<Grid item>
								<SimpleOverlayInformation
									label={t(
										"routes.AliasDetailRoute.sections.notes.form.personalNotes.label",
									)}
								>
									{isInEditMode ? (
										<TextField
											label="Personal Notes"
											multiline
											fullWidth
											key="personalNotes"
											id="personalNotes"
											name="personalNotes"
											value={formik.values.personalNotes}
											onChange={formik.handleChange}
											onBlur={formik.handleBlur}
											disabled={formik.isSubmitting}
											error={
												formik.touched.personalNotes &&
												Boolean(formik.errors.personalNotes)
											}
											helperText={
												(formik.touched.personalNotes &&
													formik.errors.personalNotes) ||
												t(
													"routes.AliasDetailRoute.sections.notes.form.personalNotes.helperText",
												)
											}
											InputProps={{
												startAdornment: (
													<InputAdornment position="start">
														<RiStickyNoteFill />
													</InputAdornment>
												),
											}}
										/>
									) : (
										notes.data.personalNotes
									)}
								</SimpleOverlayInformation>
							</Grid>
							<Grid item>
								<SimpleOverlayInformation
									label={t(
										"routes.AliasDetailRoute.sections.notes.form.websites.label",
									)}
									emptyText={t(
										"routes.AliasDetailRoute.sections.notes.form.websites.emptyText",
									)}
								>
									{isInEditMode ? (
										<Grid item>
											<AddWebsiteField
												onAdd={async website => {
													await formik.setFieldValue("websites", [
														...formik.values.websites,
														{
															url: website,
														},
													])
												}}
												isLoading={formik.isSubmitting}
											/>
											<FormikProvider value={formik}>
												<FieldArray
													name="websites"
													render={arrayHelpers => (
														<List>
															{formik.values.websites.map(
																(website, index) => (
																	<ListItem key={website.url}>
																		<ListItemIcon>
																			<FaviconImage
																				url={website.url}
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
									) : notes.data.websites.length ? (
										<Grid item>
											<List>
												{notes.data.websites.map(website => (
													<ListItem key={website.url}>
														<ListItemIcon>
															<FaviconImage
																width={20}
																url={website.url}
															/>
														</ListItemIcon>
														<ListItemText>{website.url}</ListItemText>
													</ListItem>
												))}
											</List>
										</Grid>
									) : null}
								</SimpleOverlayInformation>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</form>
			<FormikAutoLockNavigation active={isInEditMode} formik={formik} />
		</>
	)
}
