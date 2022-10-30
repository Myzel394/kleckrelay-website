import update from "immutability-helper"

import {Alias, AliasNote, DecryptedAlias} from "~/server-types"
import {AuthContextType} from "~/AuthContext/AuthContext"
import {DEFAULT_ALIAS_NOTE} from "~/constants/values"

export default function decryptAliasNotes(
	alias: Alias,
	decryptContent: AuthContextType["_decryptUsingMasterPassword"],
): DecryptedAlias {
	if (!alias.encryptedNotes) {
		return {
			...alias,
			notes: update(DEFAULT_ALIAS_NOTE, {}),
		}
	}

	return {
		...alias,
		notes: update<AliasNote>(
			JSON.parse(decryptContent(alias.encryptedNotes)),
			{
				data: {
					createdAt: {
						$apply: createdAt =>
							createdAt ? new Date(createdAt) : null,
					},
				},
			},
		),
	}
}
