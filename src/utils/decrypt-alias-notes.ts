import {Alias, DecryptedAlias} from "~/server-types"
import {AuthContextType} from "~/AuthContext/AuthContext"
import {DEFAULT_ALIAS_NOTE} from "~/constants/values"

export default function decryptAliasNotes(
	alias: Alias,
	decryptContent: AuthContextType["_decryptUsingMasterPassword"],
): DecryptedAlias {
	if (!alias.encryptedNotes) {
		return {
			...alias,
			notes: DEFAULT_ALIAS_NOTE,
		}
	}

	return {
		...alias,
		notes: JSON.parse(decryptContent(alias.encryptedNotes)),
	}
}
