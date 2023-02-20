import {ReactElement, useLayoutEffect} from "react"
import {useNavigate} from "react-router-dom"

import {useUser} from "~/hooks"
import LoadingPage from "~/components/widgets/LoadingPage"

export default function RedirectRoute(): ReactElement {
	const navigate = useNavigate()
	const user = useUser()

	useLayoutEffect(() => {
		if (user) {
			navigate("/aliases")
		} else {
			navigate("/login")
		}
	}, [user])

	return <LoadingPage />
}
