import {createContext} from "react"

import {ServerSettings} from "~/types"

export interface ServerSettingsContextType {
	serverSettings: ServerSettings
}

// @ts-ignore
const ServerSettingsContext = createContext<ServerSettingsContextType>()

export default ServerSettingsContext
