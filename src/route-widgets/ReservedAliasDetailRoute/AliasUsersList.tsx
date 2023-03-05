import * as yup from "yup"
import {ReactElement, useState} from "react"
import {AxiosError} from "axios"
import {MdCheckCircle} from "react-icons/md"
import {FaPen} from "react-icons/fa"
import {useTranslation} from "react-i18next"
import {FieldArray, FormikProvider, useFormik} from "formik"
import {TiDelete} from "react-icons/ti"
import deepEqual from "deep-equal"
import update from "immutability-helper"

import {useMutation} from "@tanstack/react-query"
import {
	Divider,
	FormHelperText,
	Grid,
	IconButton,
	List,
	ListItem,
	ListItemSecondaryAction,
	ListItemText,
	Typography,
} from "@mui/material"

import {ReservedAlias} from "~/server-types"
import {updateReservedAlias} from "~/apis"
import {parseFastAPIError} from "~/utils"
import {queryClient} from "~/constants/react-query"
import {useErrorSuccessSnacks} from "~/hooks"
import AdminUserPicker from "~/route-widgets/ReservedAliasDetailRoute/AdminUserPicker"

export interface AliasUsersListProps {
	users: ReservedAlias["users"]
	id: string
	queryKey: readonly string[]
}

interface Form {
	users: ReservedAlias["users"]
}

export default function AliasUsersList({users, queryKey, id}: AliasUsersListProps): ReactElement {
	const {t} = useTranslation(["admin-reserved-aliases", "common"])
	const {showError, showSuccess} = useErrorSuccessSnacks()
	const {mutateAsync} = useMutation<
		ReservedAlias,
		AxiosError,
		ReservedAlias["users"],
		{previousAlias?: ReservedAlias}
	>(
		users =>
			updateReservedAlias(id, {
				users: users.map(user => ({
					id: user.id,
				})),
			}),
		{
			onMutate: async users => {
				await queryClient.cancelQueries(queryKey)

				const previousAlias = queryClient.getQueryData<ReservedAlias>(queryKey)

				queryClient.setQueryData<ReservedAlias>(queryKey, old =>
					update(old, {
						users: {
							$set: users,
						},
					}),
				)

				return {
					previousAlias,
				}
			},
			onSuccess: async newAlias => {
				showSuccess(t("messages.alias.updated", {ns: "common"}))

				await queryClient.cancelQueries(queryKey)

				queryClient.setQueryData<ReservedAlias>(queryKey, newAlias as any as ReservedAlias)
			},
			onError: (error, _, context) => {
				showError(error)

				setIsInEditMode(true)

				if (context?.previousAlias) {
					queryClient.setQueryData<ReservedAlias>(queryKey, context.previousAlias)
				}
			},
		},
	)
	const schema = yup.object().shape({
		users: yup
			.array()
			.of(
				yup.object().shape({
					id: yup.string().required(),
					email: yup.object().shape({
						address: yup.string().required(),
						id: yup.string().required(),
					}),
				}),
			)
			.label(t("fields.users.label")),
	})
	const initialValues: Form = {
		users: users,
	}
	const formik = useFormik<Form>({
		initialValues,
		validationSchema: schema,
		onSubmit: async (values, {setErrors}) => {
			try {
				await mutateAsync(values.users)
			} catch (error) {
				setErrors(parseFastAPIError(error as AxiosError) as any)
			}
		},
	})
	const [isInEditMode, setIsInEditMode] = useState<boolean>(false)

	return (
		<Grid container direction="column" spacing={1}>
			<Grid item>
				<Grid container spacing={1} direction="row">
					<Grid item>
						<Typography variant="h6" component="h3">
							{t("fields.users.label")}
						</Typography>
					</Grid>
					<Grid item>
						<IconButton
							size="small"
							disabled={formik.isSubmitting}
							onClick={async () => {
								setIsInEditMode(!isInEditMode)

								if (
									isInEditMode &&
									!deepEqual(initialValues, formik.values, {
										strict: true,
									})
								) {
									await formik.submitForm()
								}
							}}
						>
							{isInEditMode ? <MdCheckCircle /> : <FaPen />}
						</IconButton>
					</Grid>
				</Grid>
			</Grid>
			<Grid item>
				{isInEditMode ? (
					<FormikProvider value={formik}>
						<FieldArray
							name="users"
							render={arrayHelpers => (
								<List>
									{formik.values.users.map((user, index) => (
										<ListItem key={user.id}>
											<ListItemText primary={user.email.address} />
											<ListItemSecondaryAction>
												<IconButton
													edge="end"
													aria-label="delete"
													onClick={async () => {
														arrayHelpers.remove(index)
													}}
												>
													<TiDelete />
												</IconButton>
											</ListItemSecondaryAction>
										</ListItem>
									))}
									<Divider />
									<ListItem>
										<AdminUserPicker
											alreadyPicked={formik.values.users}
											onPick={user => arrayHelpers.push(user)}
										/>
									</ListItem>
								</List>
							)}
						/>
						<FormHelperText
							error={Boolean(formik.touched.users && formik.errors.users)}
						>
							{formik.touched.users && (formik.errors.users as string)}
						</FormHelperText>
					</FormikProvider>
				) : (
					<List>
						{users.map(user => (
							<ListItem key={user.id}>
								<ListItemText primary={user.email.address} />
							</ListItem>
						))}
					</List>
				)}
			</Grid>
		</Grid>
	)
}
