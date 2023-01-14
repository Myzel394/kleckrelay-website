import {Outlet} from "react-router-dom"
import React, {ReactElement} from "react"

import {AppLoadingScreen, AuthContextProvider, ExtensionSignalHandler} from "~/components"

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
