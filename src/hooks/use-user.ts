import {useLocation, useNavigate} from "react-router-dom"
import {useContext, useLayoutEffect} from "react"

import {ServerUser, User} from "~/server-types"
import {AUTHENTICATION_PATHS} from "~/constants/values"
import {AuthContext} from "~/components"

/// Returns the currently authenticated user.
// If the user is not authenticated, it will automatically redirect to the login page.
export default function useUser(): ServerUser | User {
	const location = useLocation()
	const navigate = useNavigate()
	const {user, isAuthenticated} = useContext(AuthContext)

	useLayoutEffect(() => {
		if (!isAuthenticated && !AUTHENTICATION_PATHS.includes(location.pathname)) {
			navigate("/auth/login")
		}
	}, [isAuthenticated, navigate])

	return user as ServerUser | User
}
