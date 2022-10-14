import {RouterProvider, createBrowserRouter} from "react-router-dom"
import React, {ReactElement} from "react"

import {QueryClientProvider} from "@tanstack/react-query"
import {CssBaseline, ThemeProvider} from "@mui/material"

import {queryClient} from "~/constants/react-query"
import {lightTheme} from "~/constants/themes"
import LoadCriticalContent from "~/LoadCriticalContent"
import RootRoute from "~/routes/Root"

const router = createBrowserRouter([
	{
		path: "/",
		element: <RootRoute />,
	},
])

export default function App(): ReactElement {
	return (
		<React.StrictMode>
			<QueryClientProvider client={queryClient}>
				<ThemeProvider theme={lightTheme}>
					<CssBaseline />
					<LoadCriticalContent>
						<RouterProvider router={router} />
					</LoadCriticalContent>
				</ThemeProvider>
			</QueryClientProvider>
		</React.StrictMode>
	)
}
