import {ReactElement} from "react"
import {HiUsers} from "react-icons/hi"
import {useTranslation} from "react-i18next"
import {AxiosError} from "axios"

import {useQuery} from "@tanstack/react-query"
import {
	Box,
	Checkbox,
	Chip,
	FormControl,
	FormHelperText,
	InputAdornment,
	InputLabel,
	ListItemText,
	MenuItem,
	Select,
	SelectProps,
} from "@mui/material"

import {GetAdminUsersResponse, getAdminUsers} from "~/apis"
import {useUser} from "~/hooks"

export interface UsersSelectFieldProps extends Omit<SelectProps, "onChange" | "value"> {
	onChange: SelectProps<GetAdminUsersResponse["users"]>["onChange"]
	value: GetAdminUsersResponse["users"]

	helperText?: string | string[]
	error?: boolean
}

export default function UsersSelectField({
	value,
	onChange,
	helperText,
	error,
	...props
}: UsersSelectFieldProps): ReactElement {
	const {t} = useTranslation()
	const meUser = useUser()
	const {data: {users} = {}} = useQuery<GetAdminUsersResponse, AxiosError>(
		["getAdminUsers"],
		getAdminUsers,
	)
	const findUser = (id: string) => users?.find(user => user.id === id)
	const userIds = value?.map(user => user.id) || []

	return (
		<FormControl sx={{minWidth: 180}}>
			<InputLabel id="users-select" error={error}>
				{t("routes.AdminRoute.forms.reservedAliases.fields.users.label")}
			</InputLabel>
			<Select<string[]>
				{...props}
				multiple
				labelId="users-select"
				defaultValue={[]}
				value={userIds}
				startAdornment={
					<InputAdornment position="start">
						<HiUsers />
					</InputAdornment>
				}
				renderValue={(selected: string[]) => (
					<Box sx={{display: "flex", flexWrap: "wrap", gap: 0.5}}>
						{selected.map(value => (
							<Chip key={value} label={findUser(value)!.email.address} />
						))}
					</Box>
				)}
				onChange={(event, child) => {
					if (!Array.isArray(event.target.value)) {
						return
					}

					console.log(event.target.value)
					// Since there will probably only be a few admin users, n^2 is fine
					const selectedUsers = (event.target.value as string[]).map(id =>
						users!.find(user => user.id === id),
					)
					console.log(selectedUsers)

					if (!selectedUsers) {
						return
					}

					onChange!(
						// @ts-ignore
						{
							...event,
							target: {
								...event.target,
								value: selectedUsers as GetAdminUsersResponse["users"],
							},
						},
						child,
					)
				}}
				name="users"
				id="users"
				error={error}
				label={t("routes.AdminRoute.forms.reservedAliases.fields.users.label")}
			>
				{users ? (
					users.map(user => (
						<MenuItem key={user.id} value={user.id}>
							<Checkbox checked={userIds.includes(user.id)} />
							<ListItemText
								primary={(() => {
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
							/>
						</MenuItem>
					))
				) : (
					<MenuItem value={""}>{t("general.loading")}</MenuItem>
				)}
			</Select>
			{helperText ? <FormHelperText error={error}>{helperText}</FormHelperText> : null}
		</FormControl>
	)
}
