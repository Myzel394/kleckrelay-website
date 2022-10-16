import axios from "axios"

import {Alias} from "~/server-types"
import parseAlias from "~/apis/helpers/parse-alias"

export default async function getAliases(): Promise<Array<Alias>> {
	const {data} = await axios.get(
		`${import.meta.env.VITE_SERVER_BASE_URL}/alias`,
	)

	return data.map(parseAlias)
}
