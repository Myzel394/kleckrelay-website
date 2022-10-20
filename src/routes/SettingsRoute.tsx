import React, {ReactElement} from "react"

import {Grid, Typography} from "@mui/material"

import AliasesPreferencesForm from "~/route-widgets/SettingsRoute/AliasesPreferencesForm"

export default function SettingsRoute(): ReactElement {
	return (
		<Grid container spacing={4}>
			<Grid item>
				<Typography variant="h5" component="h2">
					Settings
				</Typography>
			</Grid>
			<Grid item>
				<AliasesPreferencesForm />
			</Grid>
		</Grid>
	)
}
