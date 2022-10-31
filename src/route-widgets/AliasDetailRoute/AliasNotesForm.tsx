import * as yup from "yup"
import {TiDelete} from "react-icons/ti"
import {AxiosError} from "axios"
import {ReactElement, useContext, useMemo, useState} from "react"
import {MdCheckCircle, MdEditCalendar} from "react-icons/md"
import {RiStickyNoteFill} from "react-icons/ri"
import {FieldArray, FormikProvider, useFormik} from "formik"
import {FaPen} from "react-icons/fa"
import deepEqual from "deep-equal"
import format from "date-fns/format"
import update from "immutability-helper"

import {useMutation} from "@tanstack/react-query"
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
import {ErrorSnack, FaviconImage, SuccessSnack} from "~/components"
import {Alias, AliasNote, DecryptedAlias} from "~/server-types"
import {UpdateAliasData, updateAlias} from "~/apis"
import AddWebsiteField from "~/route-widgets/AliasDetailRoute/AddWebsiteField"
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

const SCHEMA = yup.object().shape({
	personalNotes: yup.string(),
	websites: yup.array().of(
		yup.object().shape({
			url: yup.string().url(),
			createdAt: yup.date(),
		}),
	),
})

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
	const initialValues = useMemo(
		() => ({
			personalNotes: notes.data.personalNotes,
			websites: notes.data.websites,
		}),
		[notes.data.personalNotes, notes.data.websites],
	)
	const formik = useFormik<Form>({
		validationSchema: SCHEMA,
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

	const [isInEditMode, setIsInEditMode] = useState<boolean>(false)

	return (
		<>
			<form onSubmit={formik.handleSubmit}>
				<Grid container direction="column" spacing={4}>
					<Grid item>
						<Grid container spacing={1} direction="row">
							<Grid item>
								<Typography variant="h6" component="h3">
									Notes
								</Typography>
							</Grid>
							<Grid item>
								<IconButton
									size="small"
									disabled={formik.isSubmitting}
									onClick={async () => {
										if (
											isInEditMode &&
											!deepEqual(
												initialValues,
												formik.values,
												{
													strict: true,
												},
											)
										) {
											await formik.submitForm()
										}

										setIsInEditMode(!isInEditMode)
									}}
								>
									{isInEditMode ? (
										<MdCheckCircle />
									) : (
										<FaPen />
									)}
								</IconButton>
							</Grid>
						</Grid>
					</Grid>
					<Grid item>
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
													{format(
														notes.data.createdAt,
														"Pp",
													)}
												</Typography>
											</Tooltip>
										</Grid>
									</Grid>
								</Grid>
							)}
							<Grid item>
								<Grid container spacing={1} direction="column">
									<Grid item>
										<Typography variant="overline">
											Personal Notes
										</Typography>
									</Grid>
									<Grid item>
										{isInEditMode ? (
											<TextField
												label="Personal Notes"
												multiline
												fullWidth
												key="personalNotes"
												id="personalNotes"
												name="personalNotes"
												value={
													formik.values.personalNotes
												}
												onChange={formik.handleChange}
												onBlur={formik.handleBlur}
												disabled={formik.isSubmitting}
												error={
													formik.touched
														.personalNotes &&
													Boolean(
														formik.errors
															.personalNotes,
													)
												}
												helperText={
													(formik.touched
														.personalNotes &&
														formik.errors
															.personalNotes) ||
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
										) : (
											<Typography>
												{notes.data.personalNotes}
											</Typography>
										)}
									</Grid>
								</Grid>
							</Grid>
							<Grid item>
								<Grid container spacing={1} direction="column">
									<Grid item>
										<Typography variant="overline">
											Websites
										</Typography>
									</Grid>
									{isInEditMode ? (
										<Grid item>
											<AddWebsiteField
												onAdd={async website => {
													await formik.setFieldValue(
														"websites",
														[
															...formik.values
																.websites,
															{
																url: website,
															},
														],
													)
												}}
												isLoading={formik.isSubmitting}
											/>
											<FormikProvider value={formik}>
												<FieldArray
													name="websites"
													render={arrayHelpers => (
														<List>
															{formik.values.websites.map(
																(
																	website,
																	index,
																) => (
																	<ListItem
																		key={
																			website.url
																		}
																	>
																		<ListItemIcon>
																			<FaviconImage
																				url={
																					website.url
																				}
																			/>
																		</ListItemIcon>
																		<ListItemText>
																			{
																				website.url
																			}
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
									) : (
										<Grid item>
											{notes.data.websites.length ? (
												<List>
													{notes.data.websites.map(
														website => (
															<ListItem
																key={
																	website.url
																}
															>
																<ListItemIcon>
																	<FaviconImage
																		width={
																			20
																		}
																		url={
																			website.url
																		}
																	/>
																</ListItemIcon>
																<ListItemText>
																	{
																		website.url
																	}
																</ListItemText>
															</ListItem>
														),
													)}
												</List>
											) : (
												<Typography variant="body2">
													You haven&apos;t used this
													alias on any site yet.
												</Typography>
											)}
										</Grid>
									)}
								</Grid>
							</Grid>
						</Grid>
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
