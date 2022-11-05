import {RouterProvider, createBrowserRouter} from "react-router-dom"
import {SnackbarProvider} from "notistack"
import React, {ReactElement} from "react"

import {QueryClientProvider} from "@tanstack/react-query"
import {CssBaseline, ThemeProvider} from "@mui/material"

import {queryClient} from "~/constants/react-query"
import {getServerSettings} from "~/apis"
import {lightTheme} from "~/constants/themes"
import AliasDetailRoute from "~/routes/AliasDetailRoute"
import AliasesRoute from "~/routes/AliasesRoute"
import AuthContextProvider from "~/AuthContext/AuthContextProvider"
import AuthenticateRoute from "~/routes/AuthenticateRoute"
import AuthenticatedRoute from "~/routes/AuthenticatedRoute"
import CompleteAccountRoute from "~/routes/CompleteAccountRoute"
import EnterDecryptionPassword from "~/routes/EnterDecryptionPassword"
import LoginRoute from "~/routes/LoginRoute"
import LogoutRoute from "~/routes/LogoutRoute"
import ReportDetailRoute from "~/routes/ReportDetailRoute"
import ReportsRoute from "~/routes/ReportsRoute"
import RootRoute from "~/routes/Root"
import SettingsRoute from "~/routes/SettingsRoute"
import SignupRoute from "~/routes/SignupRoute"
import VerifyEmailRoute from "~/routes/VerifyEmailRoute"

import OverviewRoute from "~/routes/OverviewRoute"
import "./init-i18n"

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
					{
						path: "/auth/logout",
						element: <LogoutRoute />,
					},
				],
			},
			{
				path: "/",
				element: <AuthenticatedRoute />,
				children: [
					{
						path: "/",
						element: <OverviewRoute />,
					},
					{
						loader: getServerSettings,
						path: "/aliases",
						element: <AliasesRoute />,
					},
					{
						path: "/aliases/:addressInBase64",
						element: <AliasDetailRoute />,
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
						loader: getServerSettings,
						path: "/reports/:id",
						element: <ReportDetailRoute />,
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
					<SnackbarProvider>
						<AuthContextProvider>
							<CssBaseline />
							<RouterProvider router={router} />
						</AuthContextProvider>
					</SnackbarProvider>
				</ThemeProvider>
			</QueryClientProvider>
		</React.StrictMode>
	)
}
