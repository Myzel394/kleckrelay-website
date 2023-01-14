import update from "immutability-helper"

import {AliasNote} from "~/server-types"
import {DEFAULT_ALIAS_NOTE} from "~/constants/values"
import {AuthContextType} from "~/components"

export default function decryptAliasNotes(
	encryptedNotes: string,
	decryptContent: AuthContextType["_decryptUsingMasterPassword"],
): AliasNote {
	if (!encryptedNotes) {
		return update(DEFAULT_ALIAS_NOTE, {})
	}

	return update<AliasNote>(JSON.parse(decryptContent(encryptedNotes)), {
		data: {
			createdAt: {
				$apply: createdAt => (createdAt ? new Date(createdAt) : null),
			},
		},
	})
}
