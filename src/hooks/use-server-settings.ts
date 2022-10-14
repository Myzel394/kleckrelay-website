import {useContext} from "react"

import {ServerSettings} from "~/types"
import ServerSettingsContext from "~/ServerSettingsContext"

export default function useServerSettings(): ServerSettings {
	const {serverSettings} = useContext(ServerSettingsContext)

	return serverSettings
}
