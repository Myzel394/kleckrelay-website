import {Outlet} from "react-router-dom"
import React, {ReactElement} from "react"

import {ExtensionSignalHandler} from "~/components"
import AppLoadingScreen from "~/AppLoadingScreen/AppLoadingScreen"
import AuthContextProvider from "~/AuthContext/AuthContextProvider"

export default function RootRoute(): ReactElement {
	return (
		<AuthContextProvider>
			<AppLoadingScreen>
				<Outlet />
			</AppLoadingScreen>
			<ExtensionSignalHandler />
		</AuthContextProvider>
	)
}
