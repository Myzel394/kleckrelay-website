import {Outlet} from "react-router-dom"
import React, {ReactElement, Suspense} from "react"

import {AppLoadingScreen, AuthContextProvider, ExtensionSignalHandler} from "~/components"
import LoadingPage from "~/components/widgets/LoadingPage"

export default function RootRoute(): ReactElement {
	return (
		<Suspense fallback={<LoadingPage />}>
			<AuthContextProvider>
				<AppLoadingScreen>
					<Outlet />
				</AppLoadingScreen>
				<ExtensionSignalHandler />
			</AuthContextProvider>
		</Suspense>
	)
}
