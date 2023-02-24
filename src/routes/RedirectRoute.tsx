import {ReactElement, useContext, useLayoutEffect} from "react"
import {useNavigate} from "react-router-dom"

import {AuthContext} from "~/components"
import LoadingPage from "~/components/widgets/LoadingPage"

export default function RedirectRoute(): ReactElement {
	const navigate = useNavigate()
	const {user} = useContext(AuthContext)

	useLayoutEffect(() => {
		if (user) {
			navigate("/aliases")
		} else {
			navigate("/auth/login")
		}
	}, [user])

	return <LoadingPage />
}
