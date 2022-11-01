import {BsImage} from "react-icons/bs"
import {ReactElement, useState} from "react"
import {MdLocationOn} from "react-icons/md"
import {useLoaderData} from "react-router-dom"
import {useTranslation} from "react-i18next"
import addHours from "date-fns/addHours"
import isBefore from "date-fns/isBefore"

import {
	Box,
	Collapse,
	Grid,
	List,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	useTheme,
} from "@mui/material"

import {DecryptedReportContent, ServerSettings} from "~/server-types"
import {isDev} from "~/constants/development"

export interface ProxiedImagesListItemProps {
	images: DecryptedReportContent["messageDetails"]["content"]["proxiedImages"]
}

export default function ProxiedImagesListItem({images}: ProxiedImagesListItemProps): ReactElement {
	const {t} = useTranslation()
	const serverSettings = useLoaderData() as ServerSettings
	const theme = useTheme()

	const [showProxiedImages, setShowProxiedImages] = useState<boolean>(false)

	return (
		<>
			<ListItemButton
				onClick={() => {
					if (images.length > 0) {
						setShowProxiedImages(value => !value)
					}
				}}
			>
				<ListItemIcon>
					<BsImage />
				</ListItemIcon>
				<ListItemText>
					{t("routes.ReportDetailRoute.sections.trackers.results.proxiedImages.text", {
						count: images.length,
					})}
				</ListItemText>
			</ListItemButton>
			<Collapse in={showProxiedImages}>
				<Box bgcolor={theme.palette.background.default}>
					<List>
						{images.map(image => (
							<ListItemButton
								href={isDev ? image.url : image.serverUrl}
								target="_blank"
								key={image.imageProxyId}
							>
								<ListItemText
									primary={image.url}
									secondary={
										<>
											<Grid
												display="flex"
												flexDirection="row"
												alignItems="center"
												container
												component="span"
												spacing={1}
											>
												<Grid item component="span">
													<MdLocationOn />
												</Grid>
												<Grid item component="span">
													{(() => {
														if (
															isBefore(
																new Date(),
																addHours(
																	image.createdAt,
																	serverSettings.imageProxyLifeTime,
																),
															)
														) {
															return t(
																"routes.ReportDetailRoute.sections.trackers.results.proxiedImages.status.isStored",
															)
														} else {
															return t(
																"routes.ReportDetailRoute.sections.trackers.results.proxiedImages.status.isProxying",
															)
														}
													})()}
												</Grid>
											</Grid>
										</>
									}
								/>
							</ListItemButton>
						))}
					</List>
				</Box>
			</Collapse>
		</>
	)
}
