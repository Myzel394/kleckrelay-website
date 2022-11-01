import {ReactElement} from "react"
import {useTranslation} from "react-i18next"

import {Grid, Typography} from "@mui/material"

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
				<Grid container spacing={1} flexDirection="row" alignItems="center">
					{icon && <Grid item>{icon}</Grid>}
					<Grid item>
						{children || <Typography variant="body2">{emptyTextValue}</Typography>}
					</Grid>
				</Grid>
			</Grid>
		</Grid>
	)
}
