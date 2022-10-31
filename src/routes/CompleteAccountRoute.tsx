import {ReactElement, useState} from "react"
import {useLocation, useNavigate} from "react-router-dom"

import {MultiStepForm} from "~/components"
import GenerateEmailReportsForm from "~/route-widgets/CompleteAccountRoute/GenerateEmailReportsForm"
import PasswordForm from "~/route-widgets/CompleteAccountRoute/PasswordForm"

export default function CompleteAccountRoute(): ReactElement {
	const navigate = useNavigate()
	const location = useLocation()

	// If query `setup` is `true`, skip directly to the setup
	const [showGenerationReportForm, setShowGenerationReportForm] = useState(
		() => {
			const searchParams = new URLSearchParams(location.search)
			return searchParams.get("setup") === "true"
		},
	)

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
