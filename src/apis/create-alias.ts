import axios from "axios"

import {
	Alias,
	AliasType,
	ImageProxyFormatType,
	ProxyUserAgentType,
} from "~/server-types"
import parseAlias from "~/apis/helpers/parse-alias"

interface CreateAliasDataOther {
	isActive?: boolean
	encryptedNotes?: string
	removeTrackers?: boolean
	createMailReport?: boolean
	proxyImages?: boolean
	imageProxyFormat?: ImageProxyFormatType
	imageProxyUserAgent?: ProxyUserAgentType
}

interface CreateAliasDataBase extends CreateAliasDataOther {
	type: AliasType
	local?: string
}

interface CreateAliasDataRandomType extends CreateAliasDataBase {
	type: AliasType.RANDOM
	local?: undefined
}

interface CreateAliasDataCustomType extends CreateAliasDataBase {
	type: AliasType.CUSTOM
	local: string
}

export type CreateAliasData =
	| CreateAliasDataRandomType
	| CreateAliasDataCustomType

export default async function createAlias(
	aliasData: CreateAliasData,
): Promise<Alias> {
	const {data} = await axios.post(
		`${import.meta.env.VITE_SERVER_BASE_URL}/alias`,
		{},
	)

	return parseAlias(data)
}
