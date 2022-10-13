import {Box, Container} from "@mui/material"
import React, {ReactElement} from "react"

export interface MultiStepFormElementProps {
	children: ReactElement
}

export default function MultiStepFormElement({
	children,
}: MultiStepFormElementProps): ReactElement {
	return (
		<Box width="90vw" justifyContent="center" alignItems="center">
			<Container maxWidth="xs">{children}</Container>
		</Box>
	)
}
