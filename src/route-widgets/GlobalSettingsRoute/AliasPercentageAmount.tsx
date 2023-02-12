import {ReactElement} from "react"
import {useTranslation} from "react-i18next"

import {Alert, Typography} from "@mui/material"

export interface AliasPercentageAmountProps {
	characters: string
	length: number
	percentage: number
}

export default function AliasesPercentageAmount({
	characters,
	length,
	percentage,
}: AliasPercentageAmountProps): ReactElement {
	const {t} = useTranslation()

	const amount = Math.floor(Math.pow(characters.length, length) * percentage)

	return (
		<Alert severity="info" variant="standard">
			<Typography variant="subtitle1" component="h5">
				{t("routes.AdminRoute.settings.randomAliasesIncreaseExplanation", {
					originalLength: length,
					increasedLength: length + 1,
					amount,
				})}
			</Typography>
		</Alert>
	)
}
