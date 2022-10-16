import {ReactElement, useState} from "react"
import {useNavigate} from "react-router-dom"

import {MultiStepForm} from "~/components"
import GenerateEmailReportsForm from "~/route-widgets/CompleteAccountRoute/GenerateEmailReportsForm"
import PasswordForm from "~/route-widgets/CompleteAccountRoute/PasswordForm"

export default function CompleteAccountRoute(): ReactElement {
	const navigate = useNavigate()

	const [showGenerationReportForm, setShowGenerationReportForm] =
		useState(false)

	return (
		<MultiStepForm
			steps={[
				<GenerateEmailReportsForm
					key="generate_email_reports"
					onYes={() => setShowGenerationReportForm(true)}
					onNo={() => navigate("/")}
				/>,
				<PasswordForm key="password_form" />,
			]}
			index={showGenerationReportForm ? 1 : 0}
		/>
	)
}
