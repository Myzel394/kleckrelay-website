import {RouterProvider, createBrowserRouter} from "react-router-dom"
import React, {ReactElement} from "react"

import {QueryClientProvider} from "@tanstack/react-query"
import {CssBaseline, ThemeProvider} from "@mui/material"

import {queryClient} from "~/constants/react-query"
import {lightTheme} from "~/constants/themes"
import {getServerSettings} from "~/apis"
import AuthContextProvider from "~/AuthContext/AuthContextProvider"
import AuthenticateRoute from "~/routes/AuthenticateRoute"
import AuthenticatedRoute from "~/routes/AuthenticatedRoute"
import RootRoute from "~/routes/Root"
import SignupRoute from "~/routes/SignupRoute"
import VerifyEmailRoute from "~/routes/VerifyEmailRoute"

const router = createBrowserRouter([
	{
		path: "/",
		element: <RootRoute />,
		errorElement: <div></div>,
		children: [
			{
				path: "/auth",
				element: <AuthenticateRoute />,
				children: [
					{
						loader: getServerSettings,
						path: "/auth/verify-email",
						element: <VerifyEmailRoute />,
					},
					{
						loader: getServerSettings,
						path: "/auth/signup",
						element: <SignupRoute />,
					},
				],
			},
			{
				path: "/",
				element: <AuthenticatedRoute />,
			},
		],
	},
])

export default function App(): ReactElement {
	return (
		<React.StrictMode>
			<QueryClientProvider client={queryClient}>
				<ThemeProvider theme={lightTheme}>
					<AuthContextProvider>
						<CssBaseline />
						<RouterProvider router={router} />
					</AuthContextProvider>
				</ThemeProvider>
			</QueryClientProvider>
		</React.StrictMode>
	)
}
