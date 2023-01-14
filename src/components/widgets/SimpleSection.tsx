import {ReactElement, ReactNode} from "react"

import {Grid, Typography} from "@mui/material"

export interface SimpleSectionProps {
	label: string
	children: ReactNode
}

export default function SimpleSection({label, children}: SimpleSectionProps): ReactElement {
	return (
		<Grid container direction="column" spacing={1}>
			<Grid item>
				<Typography variant="h6" component="h2">
					{label}
				</Typography>
			</Grid>
			<Grid item>{children}</Grid>
		</Grid>
	)
}
