import {Grid, List, ListItem, ListItemText, Typography, useTheme} from "@mui/material"
import {ReactElement} from "react"
import {MdMail} from "react-icons/md"
import {useLoaderData} from "react-router-dom"
import {ServerSettings} from "~/server-types"
import {useTranslation} from "react-i18next"
import {BsArrowRight} from "react-icons/bs"
import {FaMask} from "react-icons/fa"
import {HiUsers} from "react-icons/hi"

export interface AliasExplanationProps {
	local: string
	emails: string[]
}

export default function AliasExplanation({local, emails}: AliasExplanationProps): ReactElement {
	const {t} = useTranslation("admin-reserved-aliases")
	const theme = useTheme()
	const serverSettings = useLoaderData() as ServerSettings

	return (
		<Grid
			container
			direction="row"
			padding={4}
			gap={4}
			borderRadius={theme.shape.borderRadius}
			border={1}
			borderColor={theme.palette.text.disabled}
			bgcolor={theme.palette.background.default}
			flexWrap="nowrap"
		>
			<Grid item>
				<Grid container direction="column" spacing={1} alignItems="center">
					<Grid item>
						<MdMail size={24} />
					</Grid>
					<Grid item>
						<Typography variant="caption" textAlign="center">
							{t("createNew.explanation.step1")}
						</Typography>
					</Grid>
				</Grid>
			</Grid>
			<Grid item>
				<Grid container direction="column" spacing={1} alignItems="center">
					<Grid item>
						<BsArrowRight size={24} />
					</Grid>
					<Grid item>
						<Typography variant="caption" textAlign="center">
							{t("createNew.explanation.step2")}
						</Typography>
					</Grid>
				</Grid>
			</Grid>
			<Grid item>
				<Grid container direction="column" spacing={1} alignItems="center">
					<Grid item>
						<FaMask size={24} />
					</Grid>
					<Grid item>
						<Typography variant="body1" textAlign="center">
							<span style={{display: "block"}}>{local}</span>
							<span style={{opacity: 0.4, wordBreak: "break-word"}}>
								@{serverSettings.mailDomain}
							</span>
						</Typography>
					</Grid>
				</Grid>
			</Grid>
			<Grid item>
				<Grid container direction="column" spacing={1} alignItems="center">
					<Grid item>
						<BsArrowRight size={24} />
					</Grid>
					<Grid item>
						<Typography variant="caption" textAlign="center">
							{t("createNew.explanation.step4")}
						</Typography>
					</Grid>
				</Grid>
			</Grid>
			<Grid item>
				<Grid container direction="column" spacing={1} alignItems="center">
					<Grid item>
						<HiUsers size={24} />
					</Grid>
					<Grid item>
						<List dense>
							{emails.map(email => (
								<ListItem key={email}>
									<ListItemText primary={email} />
								</ListItem>
							))}
						</List>
					</Grid>
				</Grid>
			</Grid>
		</Grid>
	)
}
