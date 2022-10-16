import {FaLongArrowAltRight} from "react-icons/fa"
import {TiCancel} from "react-icons/ti"
import React, {ReactElement} from "react"

import {Box, Button, Grid, Typography} from "@mui/material"
import {MultiStepFormElement} from "~/components"
import {mdiTextBoxMultiple} from "@mdi/js/commonjs/mdi"
import Icon from "@mdi/react"

export interface GenerateEmailReportsFormProps {
	onYes: () => void
	onNo: () => void
}

export default function GenerateEmailReportsForm({
	onNo,
	onYes,
}: GenerateEmailReportsFormProps): ReactElement {
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
					<Grid
						container
						direction="column"
						spacing={4}
						alignItems="center"
					>
						<Grid item>
							<Grid container spacing={4} direction="column">
								<Grid item>
									<Typography
										variant="h6"
										component="h2"
										align="center"
									>
										Generate Email Reports?
									</Typography>
								</Grid>
								<Grid item>
									<Box display="flex" justifyContent="center">
										<Icon
											path={mdiTextBoxMultiple}
											size={2}
										/>
									</Box>
								</Grid>
								<Grid item>
									<Typography
										variant="subtitle1"
										component="p"
									>
										Would you like to create fully encrypted
										email reports for your mails? Only you
										will be able to access it. Not even we
										can decrypt it.
									</Typography>
								</Grid>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
				<Grid item>
					<Grid container spacing={2} direction="row">
						<Grid item>
							<Button
								startIcon={<TiCancel />}
								color="secondary"
								onClick={onNo}
							>
								No
							</Button>
						</Grid>
						<Grid item>
							<Button
								endIcon={<FaLongArrowAltRight />}
								color="primary"
								onClick={onYes}
							>
								Yes
							</Button>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</MultiStepFormElement>
	)
}
