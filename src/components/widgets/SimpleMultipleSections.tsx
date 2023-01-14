import {ReactElement} from "react"

import {Grid} from "@mui/material"

export interface SimpleMultipleSectionsProps {
	children: ReactElement[]
}

export default function SimpleMultipleSections({
	children,
}: SimpleMultipleSectionsProps): ReactElement {
	return (
		<Grid container spacing={6} direction="column">
			{children.map(child => (
				<Grid item key={child.key}>
					{child}
				</Grid>
			))}
		</Grid>
	)
}
