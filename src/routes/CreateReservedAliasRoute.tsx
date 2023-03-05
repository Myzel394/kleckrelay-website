import * as yup from "yup"
import {ReactElement} from "react"
import {AxiosError} from "axios"
import {useTranslation} from "react-i18next"
import {useFormik} from "formik"
import {BiText} from "react-icons/bi"

import {useMutation} from "@tanstack/react-query"
import {Grid, InputAdornment, TextField} from "@mui/material"

import {CreateReservedAliasData, GetAdminUsersResponse, createReservedAlias} from "~/apis"
import {useErrorSuccessSnacks, useNavigateToNext} from "~/hooks"
import {ReservedAlias} from "~/server-types"
import {parseFastAPIError} from "~/utils"
import {SimpleForm} from "~/components"
import AliasExplanation from "~/route-widgets/CreateReservedAliasRoute/AliasExplanation"
import UsersSelectField from "~/route-widgets/CreateReservedAliasRoute/UsersSelectField"

interface Form {
	local: string
	users: GetAdminUsersResponse["users"]

	isActive?: boolean

	detail?: string
}

export default function CreateReservedAliasRoute(): ReactElement {
	const {t} = useTranslation(["admin-reserved-aliases", "common"])
	const {showSuccess} = useErrorSuccessSnacks()
	const navigateToNext = useNavigateToNext("/admin/reserved-aliases")
	const {mutateAsync: createAlias} = useMutation<
		ReservedAlias,
		AxiosError,
		CreateReservedAliasData
	>(createReservedAlias, {
		onSuccess: () => {
			showSuccess(t("messages.alias.created", {ns: "common"}))
			navigateToNext()
		},
	})

	const schema = yup.object().shape({
		local: yup
			.string()
			.required()
			.label(t("fields.local.label", {ns: "common"})),
		isActive: yup.boolean().label(t("fields.active.label")),
		// Only store IDs of users, as they provide a reference to the user
		users: yup
			.array()
			.of(
				yup.object().shape({
					id: yup.string(),
					email: yup.object().shape({
						id: yup.string(),
						address: yup.string(),
					}),
				}),
			)
			.label(t("fields.users.label")),
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
					users: values.users.map(user => ({
						id: user.id,
					})),
				})
			} catch (error) {
				setErrors(parseFastAPIError(error as AxiosError))
			}
		},
	})

	return (
		<Grid container spacing={2} flexDirection="column" alignItems="center">
			<Grid item>
				<form onSubmit={formik.handleSubmit}>
					<SimpleForm
						title={t("createNew.title")}
						description={t("createNew.description")}
						isSubmitting={formik.isSubmitting}
						continueActionLabel={t("createNew.continueActionLabel")}
						nonFieldError={formik.errors.detail}
					>
						{[
							// We can improve this by using a custom component
							// that directly shows whether the alias is available or not
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
								label={t("fields.local.label", {ns: "common"})}
								value={formik.values.local}
								onChange={formik.handleChange}
								disabled={formik.isSubmitting}
								error={formik.touched.local && Boolean(formik.errors.local)}
								helperText={formik.touched.local && formik.errors.local}
							/>,
							<UsersSelectField
								key="users"
								value={formik.values.users}
								onChange={formik.handleChange}
								disabled={formik.isSubmitting}
								error={formik.touched.users && Boolean(formik.errors.users)}
								helperText={formik.errors.users as string}
							/>,
						]}
					</SimpleForm>
				</form>
			</Grid>
			<Grid item>
				<AliasExplanation
					local={formik.values.local}
					emails={formik.values.users.map(user => user.email.address)}
				/>
			</Grid>
		</Grid>
	)
}
