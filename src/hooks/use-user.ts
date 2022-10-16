import {useNavigate} from "react-router-dom"
import {useContext, useLayoutEffect} from "react"

import {User} from "~/server-types"
import AuthContext from "~/AuthContext/AuthContext"

/// Returns the currently authenticated user.
// If the user is not authenticated, it will automatically redirect to the login page.
export default function useUser(): User {
	const navigate = useNavigate()
	const {user, isAuthenticated} = useContext(AuthContext)

	useLayoutEffect(() => {
		if (!isAuthenticated) {
			navigate("/login")
		}
	}, [isAuthenticated, navigate])

	return user as User
}
