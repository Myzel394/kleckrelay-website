import React, {ReactElement} from "react"

import {MultiStepForm, SingleElementWrapper} from "~/components"
import EmailForm from "~/route-widgets/root/EmailForm/EmailForm"
import LoadingScreen from "~/LoadingScreen"
import YouGotMail from "~/route-widgets/root/YouGotMail"

export default function RootRoute(): ReactElement {
	return <LoadingScreen />

	return (
		<SingleElementWrapper>
			<MultiStepForm
				steps={[
					() => (
						<EmailForm serverSettings={{}} onSignUp={() => null} />
					),
					() => <YouGotMail domain={""} />,
				]}
				index={0}
			/>
		</SingleElementWrapper>
	)
}
