import {ReactElement, useContext, useState} from "react"
import {useNavigate} from "react-router-dom"

import {MultiStepForm} from "~/components"
import AuthContext from "~/AuthContext/AuthContext"
import ConfirmCodeForm from "~/route-widgets/LoginRoute/ConfirmCodeForm/ConfirmCodeForm"
import EmailForm from "~/route-widgets/LoginRoute/EmailForm"

export default function LoginRoute(): ReactElement {
	const navigate = useNavigate()
	const {login} = useContext(AuthContext)

	const [email, setEmail] = useState<string>("")
	const [sameRequestToken, setSameRequestToken] = useState<string>("")

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
					onConfirm={user => login(user, () => navigate("/"))}
					email={email}
					sameRequestToken={sameRequestToken}
				/>,
			]}
			index={email === "" ? 0 : 1}
		/>
	)
}
