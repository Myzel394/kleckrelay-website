import {AxiosError} from "axios"
import {useTranslation} from "react-i18next"
import {ReactElement} from "react"

import {useQuery} from "@tanstack/react-query"
import {MenuItem, TextField} from "@mui/material"

import {GetAdminUsersResponse, getAdminUsers} from "~/apis"
import {useUser} from "~/hooks"

export interface AdminUserPickerProps {
	onPick: (user: GetAdminUsersResponse["users"][0]) => void
	alreadyPicked: GetAdminUsersResponse["users"]
}

export default function AdminUserPicker({
	onPick,
	alreadyPicked,
}: AdminUserPickerProps): ReactElement {
	const {t} = useTranslation()
	const meUser = useUser()
	const {data: {users: availableUsers} = {}} = useQuery<GetAdminUsersResponse, AxiosError>(
		["getAdminUsers"],
		getAdminUsers,
	)

	if (!availableUsers) {
		return <></>
	}

	const users = availableUsers.filter(
		user => !alreadyPicked.find(picked => picked.id === user.id),
	)

	if (users.length === 0) {
		return <></>
	}

	return (
		<TextField
			fullWidth
			select
			value={null}
			label="Admin User"
			onChange={event => {
				const user = users.find(user => user.id === event.target.value)
				if (user) {
					onPick(user)
				}

				event.preventDefault()
			}}
		>
			{users.map(user => (
				<MenuItem key={user.id} value={user.id}>
					{user.id === meUser?.id
						? t("routes.AdminRoute.forms.reservedAliases.fields.users.me", {
								email: user.email.address,
						  })
						: user.email.address}
				</MenuItem>
			))}
		</TextField>
	)
}
