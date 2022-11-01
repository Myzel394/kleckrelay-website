import {ReactElement} from "react"

import {Grid} from "@mui/material"

export interface SimpleInformationContainerProps {
	children: ReactElement[]
}

export default function SimpleInformationContainer({
	children,
}: SimpleInformationContainerProps): ReactElement {
	return (
		<Grid container spacing={2} direction="column">
			{children.map(child => (
				<Grid item key={child.key}>
					{child}
				</Grid>
			))}
		</Grid>
	)
}
