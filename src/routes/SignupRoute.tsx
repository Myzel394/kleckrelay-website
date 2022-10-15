import {ReactElement} from "react"
import {useLocalStorage} from "react-use"
import {useLoaderData} from "react-router-dom"

import {MultiStepForm} from "~/components"
import {ServerSettings} from "~/server-types"
import EmailForm from "~/route-widgets/root/EmailForm"
import YouGotMail from "~/route-widgets/root/YouGotMail"

export default function SignupRoute(): ReactElement {
	const serverSettings = useLoaderData() as ServerSettings
	const [email, setEmail] = useLocalStorage<string>(
		"signup-form-state-email",
		"",
	)

	const index = email ? 1 : 0

	return (
		<MultiStepForm
			steps={[
				<EmailForm
					serverSettings={serverSettings}
					onSignUp={setEmail}
					key="email"
				/>,
				<YouGotMail
					onGoBack={() => setEmail("")}
					email={email || ""}
					key="you_got_mail"
				/>,
			]}
			index={index}
		/>
	)
}
