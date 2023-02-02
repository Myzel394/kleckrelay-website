import {ReactElement} from "react"
import {AxiosError} from "axios"

import {useQuery} from "@tanstack/react-query"

import {GetAdminUsersResponse, getAdminUsers} from "~/apis"

export interface ReservedAliasesFormProps {}

export default function ReservedAliasesForm({}: ReservedAliasesFormProps): ReactElement {
	const {data: {users} = {}} = useQuery<GetAdminUsersResponse, AxiosError>(
		["getAdminUsers"],
		getAdminUsers,
	)

	console.log(users)
}
