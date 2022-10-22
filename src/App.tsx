import {RouterProvider, createBrowserRouter} from "react-router-dom"
import React, {ReactElement} from "react"

import {QueryClientProvider} from "@tanstack/react-query"
import {CssBaseline, ThemeProvider} from "@mui/material"

import {queryClient} from "~/constants/react-query"
import {lightTheme} from "~/constants/themes"
import {getServerSettings} from "~/apis"
import AliasesRoute from "~/routes/AliasesRoute"
import AuthContextProvider from "~/AuthContext/AuthContextProvider"
import AuthenticateRoute from "~/routes/AuthenticateRoute"
import AuthenticatedRoute from "~/routes/AuthenticatedRoute"
import CompleteAccountRoute from "~/routes/CompleteAccountRoute"
import EnterDecryptionPassword from "~/routes/EnterDecryptionPassword"
import LoginRoute from "~/routes/LoginRoute"
import ReportsRoute from "~/routes/ReportsRoute"
import RootRoute from "~/routes/Root"
import SettingsRoute from "~/routes/SettingsRoute"
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
						path: "/auth/login",
						element: <LoginRoute />,
					},
					{
						loader: getServerSettings,
						path: "/auth/signup",
						element: <SignupRoute />,
					},
					{
						loader: getServerSettings,
						path: "/auth/verify-email",
						element: <VerifyEmailRoute />,
					},
					{
						path: "/auth/complete-account",
						element: <CompleteAccountRoute />,
					},
				],
			},
			{
				path: "/",
				element: <AuthenticatedRoute />,
				children: [
					{
						path: "/aliases",
						element: <AliasesRoute />,
					},
					{
						path: "/settings",
						element: <SettingsRoute />,
					},
					{
						path: "/reports",
						element: <ReportsRoute />,
					},
					{
						path: "/enter-password",
						element: <EnterDecryptionPassword />,
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
					<AuthContextProvider>
						<CssBaseline />
						<RouterProvider router={router} />
					</AuthContextProvider>
				</ThemeProvider>
			</QueryClientProvider>
		</React.StrictMode>
	)
}
