import {RouterProvider, createBrowserRouter} from "react-router-dom"
import {SnackbarProvider} from "notistack"
import React, {ReactElement} from "react"

import {QueryClientProvider} from "@tanstack/react-query"
import {CssBaseline, ThemeProvider} from "@mui/material"

import {queryClient} from "~/constants/react-query"
import {getServerSettings} from "~/apis"
import {lightTheme} from "~/constants/themes"
import AdminRoute from "~/routes/AdminRoute"
import AliasDetailRoute from "~/routes/AliasDetailRoute"
import AliasesRoute from "~/routes/AliasesRoute"
import AuthenticateRoute from "~/routes/AuthenticateRoute"
import AuthenticatedRoute from "~/routes/AuthenticatedRoute"
import CompleteAccountRoute from "~/routes/CompleteAccountRoute"
import CreateReservedAliasRoute from "~/routes/CreateReservedAliasRoute"
import EnterDecryptionPassword from "~/routes/EnterDecryptionPassword"
import GlobalSettingsRoute from "~/routes/GlobalSettingsRoute"
import I18nHandler from "./I18nHandler"
import LoginRoute from "~/routes/LoginRoute"
import LogoutRoute from "~/routes/LogoutRoute"
import OverviewRoute from "~/routes/OverviewRoute"
import ReportDetailRoute from "~/routes/ReportDetailRoute"
import ReportsRoute from "~/routes/ReportsRoute"
import ReservedAliasDetailRoute from "~/routes/ReservedAliasDetailRoute"
import ReservedAliasesRoute from "~/routes/ReservedAliasesRoute"
import RootRoute from "~/routes/Root"
import SettingsRoute from "~/routes/SettingsRoute"
import SignupRoute from "~/routes/SignupRoute"
import VerifyEmailRoute from "~/routes/VerifyEmailRoute"
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
						path: "/auth/login",
						loader: getServerSettings,
						element: <LoginRoute />,
					},
					{
						path: "/auth/signup",
						loader: getServerSettings,
						element: <SignupRoute />,
					},
					{
						path: "/auth/verify-email",
						loader: getServerSettings,
						element: <VerifyEmailRoute />,
					},
					{
						path: "/auth/complete-account",
						loader: getServerSettings,
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
						path: "/aliases",
						loader: getServerSettings,
						element: <AliasesRoute />,
					},
					{
						path: "/aliases/:id",
						loader: getServerSettings,
						element: <AliasDetailRoute />,
					},
					{
						path: "/settings",
						element: <SettingsRoute />,
					},
					{
						path: "/reports",
						loader: getServerSettings,
						element: <ReportsRoute />,
					},
					{
						path: "/reports/:id",
						loader: getServerSettings,
						element: <ReportDetailRoute />,
					},
					{
						path: "/enter-password",
						loader: getServerSettings,
						element: <EnterDecryptionPassword />,
					},
					{
						path: "/admin",
						element: <AdminRoute />,
					},
					{
						path: "/admin/reserved-aliases",
						element: <ReservedAliasesRoute />,
					},
					{
						path: "/admin/reserved-aliases/:id",
						element: <ReservedAliasDetailRoute />,
					},
					{
						path: "/admin/reserved-aliases/create",
						loader: getServerSettings,
						element: <CreateReservedAliasRoute />,
					},
					{
						path: "/admin/settings",
						loader: getServerSettings,
						element: <GlobalSettingsRoute />,
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
						<CssBaseline />
						<RouterProvider router={router} />
						<I18nHandler />
					</SnackbarProvider>
				</ThemeProvider>
			</QueryClientProvider>
		</React.StrictMode>
	)
}
