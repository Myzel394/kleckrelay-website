import {ReactElement, useContext, useEffect} from "react"
import {useNavigate} from "react-router-dom"

import {AuthContext} from "~/components"
import LoadingPage from "~/components/widgets/LoadingPage"

export default function RedirectRoute(): ReactElement {
	const navigate = useNavigate()
	const {user} = useContext(AuthContext)

	useEffect(() => {
		if (user) {
			navigate("/aliases")
		} else {
			navigate("/auth/login")
		}
	}, [user])

	return <LoadingPage />
}
