import {Outlet} from "react-router-dom"
import React, {ReactElement} from "react"

import {ExtensionSignalHandler} from "~/components"
import AppLoadingScreen from "~/AppLoadingScreen/AppLoadingScreen"

export default function RootRoute(): ReactElement {
	return (
		<>
			<AppLoadingScreen>
				<Outlet />
			</AppLoadingScreen>
			<ExtensionSignalHandler />
		</>
	)
}
