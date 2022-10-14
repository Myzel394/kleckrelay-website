import {useLocalStorage} from "react-use"
import React, {ReactElement} from "react"

import {MultiStepForm, SingleElementWrapper} from "~/components"
import EmailForm from "~/route-widgets/root/EmailForm"
import YouGotMail from "~/route-widgets/root/YouGotMail"

export default function RootRoute(): ReactElement {
	const [email, setEmail] = useLocalStorage<string>(
		"signup-form-state-email",
		"",
	)

	const index = email ? 1 : 0

	return (
		<SingleElementWrapper>
			<MultiStepForm
				steps={[
					<EmailForm onSignUp={setEmail} key="email" />,
					<YouGotMail
						domain={(email || "").split("@")[1]}
						key="you_got_mail"
					/>,
				]}
				index={index}
			/>
		</SingleElementWrapper>
	)
}
