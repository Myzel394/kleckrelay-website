import {ReactElement} from "react"
import {useTranslation} from "react-i18next"

import {Box, Grid, Typography} from "@mui/material"

export interface SimpleOverlayInformationProps {
	label: string
	emptyText?: string
	icon?: ReactElement
	children?: ReactElement | string | boolean | null
}

export default function SimpleOverlayInformation({
	label,
	emptyText,
	icon,
	children,
}: SimpleOverlayInformationProps): ReactElement {
	const {t} = useTranslation()
	const emptyTextValue = emptyText ?? t("general.emptyValue")

	return (
		<Grid container spacing={1} direction="column">
			<Grid item>
				<Typography variant="overline">{label}</Typography>
			</Grid>
			<Grid item>
				<Box display="flex" flexDirection="row" gap={1} alignItems="center">
					{icon}
					{children || <Typography variant="body2">{emptyTextValue}</Typography>}
				</Box>
			</Grid>
		</Grid>
	)
}
