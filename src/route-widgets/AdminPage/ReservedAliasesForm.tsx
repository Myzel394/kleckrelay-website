import * as yup from "yup"
import {ReactElement} from "react"
import {AxiosError} from "axios"
import {useTranslation} from "react-i18next"
import {useFormik} from "formik"

import {useMutation, useQuery} from "@tanstack/react-query"

import {
	CreateReservedAliasData,
	GetAdminUsersResponse,
	createReservedAlias,
	getAdminUsers,
} from "~/apis"
import {Grid, InputAdornment, MenuItem, TextField} from "@mui/material"
import {BiText} from "react-icons/bi"
import {HiUsers} from "react-icons/hi"
import {useErrorSuccessSnacks, useNavigateToNext, useUser} from "~/hooks"
import {ReservedAlias, ServerUser} from "~/server-types"
import {parseFastAPIError} from "~/utils"
import {SimpleForm} from "~/components"
import AliasExplanation from "~/route-widgets/AdminPage/AliasExplanation"

interface Form {
	local: string
	users: string[]

	isActive?: boolean

	nonFieldError?: string
}

export interface ReservedAliasesFormProps {}

export default function ReservedAliasesForm({}: ReservedAliasesFormProps): ReactElement {
	const {t} = useTranslation()
	const meUser = useUser()
	const {showError, showSuccess} = useErrorSuccessSnacks()
	const navigateToNext = useNavigateToNext("/admin/reserved-aliases")
	const {data: {users} = {}} = useQuery<GetAdminUsersResponse, AxiosError>(
		["getAdminUsers"],
		getAdminUsers,
	)
	const {mutateAsync: createAlias} = useMutation<
		ReservedAlias,
		AxiosError,
		CreateReservedAliasData
	>(createReservedAlias, {
		onSuccess: () => {
			showSuccess(t("relations.alias.mutations.success.aliasCreation"))
			navigateToNext()
		},
	})

	const schema = yup.object().shape({
		local: yup
			.string()
			.required()
			.label(t("routes.AdminRoute.forms.reservedAliases.fields.local.label")),
		isActive: yup
			.boolean()
			.label(t("routes.AdminRoute.forms.reservedAliases.fields.isActive.label")),
		// Only store IDs of users, as they provide a reference to the user
		users: yup
			.array()
			.of(yup.string())
			.label(t("routes.AdminRoute.forms.reservedAliases.fields.users.label")),
	})
	const formik = useFormik<Form>({
		validationSchema: schema,
		initialValues: {
			local: "",
			users: [],
		},
		onSubmit: async (values, {setErrors, resetForm}) => {
			try {
				await createAlias({
					local: values.local,
					users: values.users.map(id => ({
						id,
					})),
				})
			} catch (error) {
				setErrors(parseFastAPIError(error as AxiosError))
			}
		},
	})
	const getUser = (id: string) => users?.find(user => user.id === id) as any as ServerUser

	if (!users) return null

	return (
		<Grid container spacing={4} flexDirection="column" alignItems="center">
			<Grid item>
				<form onSubmit={formik.handleSubmit}>
					<SimpleForm
						title={t("routes.AdminRoute.forms.reservedAliases.title")}
						description={t("routes.AdminRoute.forms.reservedAliases.description")}
						isSubmitting={formik.isSubmitting}
						continueActionLabel={t(
							"routes.AdminRoute.forms.reservedAliases.saveAction",
						)}
						nonFieldError={formik.errors.nonFieldError}
					>
						{[
							<TextField
								key="local"
								fullWidth
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<BiText />
										</InputAdornment>
									),
								}}
								name="local"
								id="local"
								label={t(
									"routes.AdminRoute.forms.reservedAliases.fields.local.label",
								)}
								value={formik.values.local}
								onChange={formik.handleChange}
								disabled={formik.isSubmitting}
								error={formik.touched.local && Boolean(formik.errors.local)}
								helperText={formik.touched.local && formik.errors.local}
							/>,
							<TextField
								key="users"
								fullWidth
								select
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<HiUsers />
										</InputAdornment>
									),
								}}
								name="users"
								id="users"
								label={t(
									"routes.AdminRoute.forms.reservedAliases.fields.users.label",
								)}
								SelectProps={{
									multiple: true,
									value: formik.values.users,
									onChange: formik.handleChange,
								}}
								disabled={formik.isSubmitting}
								error={formik.touched.users && Boolean(formik.errors.users)}
								helperText={formik.touched.users && formik.errors.users}
							>
								{users.map(user => (
									<MenuItem key={user.id} value={user.id}>
										{(() => {
											// Check if user is me
											if (user.id === meUser.id) {
												return t(
													"routes.AdminRoute.forms.reservedAliases.fields.users.me",
													{
														email: user.email.address,
													},
												)
											}

											return user.email.address
										})()}
									</MenuItem>
								))}
							</TextField>,
						]}
					</SimpleForm>
				</form>
			</Grid>
			<Grid item>
				<AliasExplanation
					local={formik.values.local}
					emails={formik.values.users.map(userId => getUser(userId).email.address)}
				/>
			</Grid>
		</Grid>
	)
}
