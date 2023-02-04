import {Grid, List, ListItem, ListItemText, Typography, useTheme} from "@mui/material"
import {ReactElement} from "react"
import {MdMail} from "react-icons/md"
import {useLoaderData} from "react-router"
import {ServerSettings} from "~/server-types"
import {useTranslation} from "react-i18next"
import {BsArrowDown} from "react-icons/bs"
import {FaMask} from "react-icons/fa"
import {HiUsers} from "react-icons/hi"

export interface AliasExplanationProps {
	local: string
	emails: string[]
}

export default function AliasExplanation({local, emails}: AliasExplanationProps): ReactElement {
	const {t} = useTranslation()
	const theme = useTheme()
	const serverSettings = useLoaderData() as ServerSettings

	return (
		<Grid
			container
			direction="column"
			padding={4}
			gap={4}
			borderRadius={theme.shape.borderRadius}
			border={1}
			borderColor={theme.palette.text.disabled}
			bgcolor={theme.palette.background.default}
		>
			<Grid item>
				<Grid container direction="column" spacing={1} alignItems="center">
					<Grid item>
						<MdMail size={24} />
					</Grid>
					<Grid item>
						<Typography variant="caption" align="center">
							{t("routes.AdminRoute.forms.reservedAliases.explanation.step1")}
						</Typography>
					</Grid>
				</Grid>
			</Grid>
			<Grid item>
				<Grid container direction="column" spacing={1} alignItems="center">
					<Grid item>
						<BsArrowDown size={24} />
					</Grid>
					<Grid item>
						<Typography variant="caption" align="center">
							{t("routes.AdminRoute.forms.reservedAliases.explanation.step2")}
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
						<Typography variant="body1" align="center">
							<span style={{display: "block"}}>{local}</span>
							<span style={{opacity: 0.4}}>@{serverSettings.mailDomain}</span>
						</Typography>
					</Grid>
				</Grid>
			</Grid>
			<Grid item>
				<Grid container direction="column" spacing={1} alignItems="center">
					<Grid item>
						<BsArrowDown size={24} />
					</Grid>
					<Grid item>
						<Typography variant="caption" align="center">
							{t("routes.AdminRoute.forms.reservedAliases.explanation.step4")}
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
