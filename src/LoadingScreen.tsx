import React, {ReactElement} from "react"

import {Typography} from "@mui/material"

export default function LoadingScreen(): ReactElement {
	return (
		<Typography variant="caption" component="p">
			Loading...
		</Typography>
	)
}
