import * as inSeconds from "in-seconds"
import {AxiosError} from "axios"
import React, {ReactElement} from "react"

import {useQuery} from "@tanstack/react-query"

import {getServerSettings} from "~/apis"
import LoadingScreen from "~/LoadingScreen"

import ServerSettingsContext, {
	ServerSettingsContextType,
} from "./ServerSettingsContext"

export interface LoadCriticalContentProps {
	children: ReactElement
}

export default function LoadCriticalContent({
	children,
}: LoadCriticalContentProps): ReactElement {
	const {data} = useQuery<ServerSettingsContextType, AxiosError>(
		["server-settings"],
		async () => {
			const settings = await getServerSettings()

			return {
				serverSettings: settings,
			}
		},
		{
			staleTime: inSeconds.days(20),
		},
	)

	if (!data) {
		return <LoadingScreen />
	}

	return (
		<ServerSettingsContext.Provider value={data}>
			{children}
		</ServerSettingsContext.Provider>
	)
}
