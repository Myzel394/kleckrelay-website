import {RouterProvider, createBrowserRouter} from "react-router-dom"
import {SnackbarProvider} from "notistack"
import React, {ReactElement} from "react"

import {QueryClientProvider} from "@tanstack/react-query"
import {CssBaseline, Theme, ThemeProvider} from "@mui/material"

import {queryClient} from "~/constants/react-query"
import {getServerSettings} from "~/apis"
import {darkTheme, lightTheme} from "~/constants/themes"
import AdminRoute from "~/routes/AdminRoute"
import AliasDetailRoute from "~/routes/AliasDetailRoute"
import AliasesRoute from "~/routes/AliasesRoute"
import AuthenticateRoute from "~/routes/AuthenticateRoute"
import AuthenticatedRoute from "~/routes/AuthenticatedRoute"
import CompleteAccountRoute from "~/routes/CompleteAccountRoute"
import CreateReservedAliasRoute from "~/routes/CreateReservedAliasRoute"
import EnterDecryptionPassword from "~/routes/EnterDecryptionPassword"
import ErrorPage from "~/components/widgets/ErrorPage"
import GlobalSettingsRoute from "~/routes/GlobalSettingsRoute"
import I18nHandler from "./I18nHandler"
import LoginRoute from "~/routes/LoginRoute"
import LogoutRoute from "~/routes/LogoutRoute"
import RedirectRoute from "./routes/RedirectRoute"
import ReportDetailRoute from "~/routes/ReportDetailRoute"
import ReportsRoute from "~/routes/ReportsRoute"
import ReservedAliasDetailRoute from "~/routes/ReservedAliasDetailRoute"
import ReservedAliasesRoute from "~/routes/ReservedAliasesRoute"
import RootRoute from "~/routes/Root"
import SettingsRoute from "~/routes/SettingsRoute"
import SignupRoute from "~/routes/SignupRoute"
import VerifyEmailRoute from "~/routes/VerifyEmailRoute"
import useSystemTheme, {SystemTheme} from "use-system-theme"
import "./init-i18n"

const router = createBrowserRouter([
	{
		path: "/",
		element: <RootRoute />,
		errorElement: <ErrorPage />,
		children: [
			{
				path: "/",
				element: <RedirectRoute />,
			},
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
						loader: getServerSettings,
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

const THEME_THEME_MAP: Record<SystemTheme, Theme> = {
	light: lightTheme,
	dark: darkTheme,
}

export default function App(): ReactElement {
	const theme = useSystemTheme()

	return (
		<React.StrictMode>
			<QueryClientProvider client={queryClient}>
				<ThemeProvider theme={THEME_THEME_MAP[theme]}>
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
