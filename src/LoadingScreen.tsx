import React, {ReactElement} from "react"

import {Typography} from "@mui/material"

import {SingleElementWrapper} from "~/components"

export default function LoadingScreen(): ReactElement {
	return (
		<SingleElementWrapper>
			<Typography variant="caption" component="p">
				Loading...
			</Typography>
		</SingleElementWrapper>
	)
}
