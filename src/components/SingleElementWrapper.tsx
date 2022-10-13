import {ReactElement} from "react"
import {Box} from "@mui/material"

export interface SingleElementWrapperProps {
	children: ReactElement
}

const style = {
	minHeight: "100vh",
}

export default function SingleElementWrapper({
	children,
}: SingleElementWrapperProps): ReactElement {
	return (
		<Box
			display="flex"
			flexDirection="column"
			alignItems="center"
			justifyContent="center"
			sx={style}
		>
			{children}
		</Box>
	)
}
