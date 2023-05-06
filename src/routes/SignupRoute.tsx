import {ReactElement} from "react"
import {useLoaderData} from "react-router-dom"

import {useLocalStorageValue} from "@react-hookz/web"

import {MultiStepForm} from "~/components"
import {ServerSettings} from "~/server-types"
import EmailForm from "~/route-widgets/SignupRoute/EmailForm"
import RegistrationsDisabled from "~/route-widgets/SignupRoute/RegistrationsDisabled"
import YouGotMail from "~/route-widgets/SignupRoute/YouGotMail"

export default function SignupRoute(): ReactElement {
	const serverSettings = useLoaderData() as ServerSettings
	const {
		value: email,
		set: setEmail,
		remove: removeEmail,
	} = useLocalStorageValue<string>("signup-form-state-email", {
		defaultValue: "",
	})

	const index = email ? 1 : 0

	if (!serverSettings.allowRegistrations) {
		return <RegistrationsDisabled />
	}

	return (
		<MultiStepForm
			steps={[
				<EmailForm serverSettings={serverSettings} onSignUp={setEmail} key="email" />,
				<YouGotMail onGoBack={() => removeEmail} email={email!} key="you_got_mail" />,
			]}
			index={index}
		/>
	)
}
