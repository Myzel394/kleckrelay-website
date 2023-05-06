import {ReactElement, useContext, useState} from "react"
import {useNavigate} from "react-router-dom"

import {useUpdateEffect} from "@react-hookz/web"

import {AuthContext, MultiStepForm} from "~/components"
import {useQueryParams} from "~/hooks"
import ConfirmCodeForm from "~/route-widgets/LoginRoute/ConfirmCodeForm/ConfirmCodeForm"
import ConfirmFromDifferentDevice from "~/route-widgets/LoginRoute/ConfirmFromDifferentDevice"
import EmailForm from "~/route-widgets/LoginRoute/EmailForm"
import OTPForm from "~/route-widgets/LoginRoute/OTPForm"

export default function LoginRoute(): ReactElement {
	const navigate = useNavigate()
	const {token, email: queryEmail} = useQueryParams<{token: string; email: string}>()
	const {login, user} = useContext(AuthContext)

	const [step, setStep] = useState<number>(0)
	const [email, setEmail] = useState<string>("")
	const [sameRequestToken, setSameRequestToken] = useState<string>("")

	useUpdateEffect(() => {
		if (!user) {
			return
		}

		if (user?.encryptedPassword) {
			navigate("/enter-password")
		} else {
			navigate("/aliases")
		}
	}, [user, navigate])

	if (token && queryEmail) {
		return <ConfirmFromDifferentDevice email={queryEmail} token={token} onConfirm={login} />
	}

	return (
		<MultiStepForm
			steps={[
				<EmailForm
					key="email_form"
					email={email}
					onLogin={(email, sameRequestToken) => {
						setEmail(email)
						setStep(1)
						setSameRequestToken(sameRequestToken)
					}}
				/>,
				<ConfirmCodeForm
					key={`confirm_code_form:${email}:${step}`}
					email={email}
					sameRequestToken={sameRequestToken}
					onConfirm={login}
					onCodeExpired={() => {
						setStep(0)
					}}
					onOTPRequested={corsToken => {
						setStep(2)
						setSameRequestToken(corsToken)
					}}
				/>,
				<OTPForm
					onConfirm={login}
					key={`otp_form:${email}:${step}`}
					corsToken={sameRequestToken}
					onCodeUnavailable={() => setStep(0)}
				/>,
			]}
			index={step}
		/>
	)
}
