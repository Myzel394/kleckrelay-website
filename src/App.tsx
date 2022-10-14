import {RouterProvider, createBrowserRouter} from "react-router-dom"
import React, {ReactElement} from "react"

import {QueryClientProvider} from "@tanstack/react-query"
import {CssBaseline, ThemeProvider} from "@mui/material"

import {queryClient} from "~/constants/react-query"
import {lightTheme} from "~/constants/themes"
import {getServerSettings} from "~/apis"
import RootRoute from "~/routes/Root"
import SignupRoute from "~/routes/SignupRoute"
import SingleElementRoute from "~/routes/SingleElementRoute"
import VerifyEmailRoute from "~/routes/VerifyEmailRoute"

const router = createBrowserRouter([
	{
		path: "/",
		element: <RootRoute />,
		errorElement: <div></div>,
		children: [
			{
				path: "/",
				element: <SingleElementRoute />,
				children: [
					{
						loader: getServerSettings,
						path: "/verify-email",
						element: <VerifyEmailRoute />,
					},
					{
						loader: getServerSettings,
						path: "/signup",
						element: <SignupRoute />,
					},
				],
			},
		],
	},
])

export default function App(): ReactElement {
	return (
		<React.StrictMode>
			<QueryClientProvider client={queryClient}>
				<ThemeProvider theme={lightTheme}>
					<CssBaseline />
					<RouterProvider router={router} />
				</ThemeProvider>
			</QueryClientProvider>
		</React.StrictMode>
	)
}
