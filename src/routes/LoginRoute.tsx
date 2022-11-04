import {ReactElement, useContext, useState} from "react"
import {useNavigate} from "react-router-dom"
import {useUpdateEffect} from "react-use"

import {MultiStepForm} from "~/components"
import {useQueryParams} from "~/hooks"
import AuthContext from "~/AuthContext/AuthContext"
import ConfirmCodeForm from "~/route-widgets/LoginRoute/ConfirmCodeForm/ConfirmCodeForm"
import ConfirmFromDifferentDevice from "~/route-widgets/LoginRoute/ConfirmFromDifferentDevice"
import EmailForm from "~/route-widgets/LoginRoute/EmailForm"

export default function LoginRoute(): ReactElement {
	const navigate = useNavigate()
	const {token, email: queryEmail} = useQueryParams<{token: string; email: string}>()
	const {login, user} = useContext(AuthContext)

	const [email, setEmail] = useState<string>("")
	const [sameRequestToken, setSameRequestToken] = useState<string>("")

	useUpdateEffect(() => {
		if (!user) {
			return
		}

		if (user?.encryptedPassword) {
			navigate("/enter-password")
		} else {
			navigate("/")
		}
	}, [user?.encryptedPassword])

	if (token && queryEmail) {
		return <ConfirmFromDifferentDevice email={queryEmail} token={token} onConfirm={login} />
	}

	return (
		<MultiStepForm
			steps={[
				<EmailForm
					key="email_form"
					onLogin={(email, sameRequestToken) => {
						setEmail(email)
						setSameRequestToken(sameRequestToken)
					}}
				/>,
				<ConfirmCodeForm
					key="confirm_code_form"
					onConfirm={login}
					email={email}
					sameRequestToken={sameRequestToken}
				/>,
			]}
			index={email === "" ? 0 : 1}
		/>
	)
}
