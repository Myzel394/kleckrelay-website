import {ReactElement, useContext} from "react"
import {useParams} from "react-router-dom"
import {AxiosError} from "axios"

import {useQuery} from "@tanstack/react-query"

import {getAlias} from "~/apis"
import {Alias, DecryptedAlias} from "~/server-types"
import {QueryResult, SimplePage} from "~/components"
import {decryptAliasNotes} from "~/utils"
import AliasDetails from "~/route-widgets/AliasDetailRoute/AliasDetails"
import AuthContext, {EncryptionStatus} from "~/AuthContext/AuthContext"

export default function AliasDetailRoute(): ReactElement {
	const params = useParams()
	const address = atob(params.addressInBase64 as string)
	const {_decryptUsingMasterPassword, encryptionStatus} =
		useContext(AuthContext)

	const query = useQuery<Alias | DecryptedAlias, AxiosError>(
		["get_alias", params.addressInBase64],
		async () => {
			if (encryptionStatus === EncryptionStatus.Available) {
				return decryptAliasNotes(
					await getAlias(address),
					_decryptUsingMasterPassword,
				)
			} else {
				return getAlias(address)
			}
		},
	)

	return (
		<SimplePage title="Alias Details">
			<QueryResult<Alias | DecryptedAlias> query={query}>
				{alias => <AliasDetails alias={alias} />}
			</QueryResult>
		</SimplePage>
	)
}
