import {ReactNode} from "react"

import {Grid, Typography} from "@mui/material"

export interface SimplePageProps {
	title: string
	children: ReactNode

	subtitle?: string
	pageOptionsActions?: ReactNode
	description?: string
	actions?: ReactNode
}

export default function SimplePage({
	title,
	subtitle,
	pageOptionsActions,
	actions,
	description,
	children,
}: SimplePageProps): JSX.Element {
	return (
		<Grid container spacing={4} flexDirection="column" alignItems="start">
			<Grid item>
				<Typography variant="h4" component="h1">
					{title}
				</Typography>
			</Grid>
			<Grid item width="100%">
				<Grid container spacing={4} flexDirection="column" alignItems="stretch">
					{subtitle && (
						<Grid item>
							<Typography variant="h6" component="h2">
								{subtitle}
							</Typography>
						</Grid>
					)}
					{description && (
						<Grid item>
							<Typography variant="body1" component="p">
								{description}
							</Typography>
						</Grid>
					)}
					{pageOptionsActions && <Grid item>{pageOptionsActions}</Grid>}
					<Grid item>{children}</Grid>
				</Grid>
			</Grid>
			{actions && <Grid item>{actions}</Grid>}
		</Grid>
	)
}
