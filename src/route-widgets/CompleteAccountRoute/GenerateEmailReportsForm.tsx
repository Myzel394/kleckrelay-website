import {FaLongArrowAltRight} from "react-icons/fa"
import {TiCancel} from "react-icons/ti"
import {useTranslation} from "react-i18next"
import {MdTextSnippet} from "react-icons/md"
import React, {ReactElement} from "react"

import {Box, Button, Grid, Typography} from "@mui/material"

import {MultiStepFormElement} from "~/components"

export interface GenerateEmailReportsFormProps {
	onYes: () => void
	onNo: () => void
}

export default function GenerateEmailReportsForm({
	onNo,
	onYes,
}: GenerateEmailReportsFormProps): ReactElement {
	const {t} = useTranslation(["complete-account", "common"])

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
										{t("forms.askForGeneration.title")}
									</Typography>
								</Grid>
								<Grid item>
									<Box display="flex" justifyContent="center">
										<MdTextSnippet size={64} />
									</Box>
								</Grid>
								<Grid item>
									<Typography variant="subtitle1" component="p">
										{t("forms.askForGeneration.description")}
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
								{t("general.noLabel", {ns: "common"})}
							</Button>
						</Grid>
						<Grid item>
							<Button
								endIcon={<FaLongArrowAltRight />}
								color="primary"
								onClick={onYes}
							>
								{t("general.yesLabel", {ns: "common"})}
							</Button>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</MultiStepFormElement>
	)
}
