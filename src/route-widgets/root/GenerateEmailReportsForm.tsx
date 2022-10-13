import {ReactElement} from "react"
import {Box, Button, Grid, Typography} from "@mui/material"
import {FaLongArrowAltRight} from "react-icons/fa"
import {TiCancel} from "react-icons/ti"

export interface GenerateEmailReportsFormProps {
	onYes: () => void
	onNo: () => void
}

export default function GenerateEmailReportsForm({
	onNo,
	onYes,
}: GenerateEmailReportsFormProps): ReactElement {
	return (
		<Box width="80vw">
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
							<Grid container spacing={2} direction="column">
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
		</Box>
	)
}
