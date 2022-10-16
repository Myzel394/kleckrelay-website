import {ReactElement, useEffect, useState} from "react"

import {CircularProgress, Grid, Typography} from "@mui/material"

export interface LoadingDataProps {
	message?: string
}

export default function LoadingData({
	message = "Loading",
}: LoadingDataProps): ReactElement {
	const [ellipsis, setEllipsis] = useState<string>("")

	useEffect(() => {
		const interval = setInterval(() => {
			setEllipsis((value: string) => {
				if (value.length === 3) {
					return ""
				}

				return value + "."
			})
		}, 300)

		return () => clearInterval(interval)
	}, [])

	return (
		<Grid container spacing={2} direction="column" alignItems="center">
			<Grid item>
				<CircularProgress />
			</Grid>
			<Grid item>
				<Typography variant="caption">Loading{ellipsis}</Typography>
			</Grid>
		</Grid>
	)
}
