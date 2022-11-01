import {FaLongArrowAltRight} from "react-icons/fa"
import {TiCancel} from "react-icons/ti"
import React, {ReactElement} from "react"

import {Box, Button, Grid, Typography} from "@mui/material"
import {MultiStepFormElement} from "~/components"
import {mdiTextBoxMultiple} from "@mdi/js/commonjs/mdi"
import {useTranslation} from "react-i18next"
import Icon from "@mdi/react"

export interface GenerateEmailReportsFormProps {
	onYes: () => void
	onNo: () => void
}

export default function GenerateEmailReportsForm({
	onNo,
	onYes,
}: GenerateEmailReportsFormProps): ReactElement {
	const {t} = useTranslation()

	return (
		<MultiStepFormElement>
			<Grid
				container
				direction="column"
				spacing={4}
				paddingX={2}
				paddingTop={4}
				paddingBottom={1}
				alignItems="end"
				justifyContent="center"
			>
				<Grid item>
					<Grid container direction="column" spacing={4} alignItems="center">
						<Grid item>
							<Grid container spacing={4} direction="column">
								<Grid item>
									<Typography variant="h6" component="h2" align="center">
										{t(
											"routes.CompleteAccountRoute.forms.generateReports.title",
										)}
									</Typography>
								</Grid>
								<Grid item>
									<Box display="flex" justifyContent="center">
										<Icon path={mdiTextBoxMultiple} size={2} />
									</Box>
								</Grid>
								<Grid item>
									<Typography variant="subtitle1" component="p">
										{t(
											"routes.CompleteAccountRoute.forms.generateReports.description",
										)}
									</Typography>
								</Grid>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
				<Grid item>
					<Grid container spacing={2} direction="row">
						<Grid item>
							<Button startIcon={<TiCancel />} color="secondary" onClick={onNo}>
								{t(
									"routes.CompleteAccountRoute.forms.generateReports.cancelAction",
								)}
							</Button>
						</Grid>
						<Grid item>
							<Button
								endIcon={<FaLongArrowAltRight />}
								color="primary"
								onClick={onYes}
							>
								{t(
									"routes.CompleteAccountRoute.forms.generateReports.continueAction",
								)}
							</Button>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</MultiStepFormElement>
	)
}
