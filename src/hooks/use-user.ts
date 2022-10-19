import {useLocation, useNavigate} from "react-router-dom"
import {useContext, useLayoutEffect} from "react"

import {ServerUser} from "~/server-types"
import AuthContext from "~/AuthContext/AuthContext"

const AUTHENTICATION_PATHS = [
	"/auth/login",
	"/auth/signup",
	"/auth/complete-account",
]

/// Returns the currently authenticated user.
// If the user is not authenticated, it will automatically redirect to the login page.
export default function useUser(): ServerUser {
	const location = useLocation()
	const navigate = useNavigate()
	const {user, isAuthenticated} = useContext(AuthContext)

	useLayoutEffect(() => {
		if (
			!isAuthenticated &&
			!AUTHENTICATION_PATHS.includes(location.pathname)
		) {
			navigate("/auth/login")
		}
	}, [isAuthenticated, navigate])

	return user as ServerUser
}
