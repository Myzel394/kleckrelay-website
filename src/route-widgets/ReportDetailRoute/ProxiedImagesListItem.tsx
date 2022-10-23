import {BsImage} from "react-icons/bs"
import {ReactElement, useState} from "react"
import {MdLocationOn} from "react-icons/md"
import {useLoaderData} from "react-router-dom"
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

export interface ProxiedImagesListItemProps {
	images: DecryptedReportContent["messageDetails"]["content"]["proxiedImages"]
}

export default function ProxiedImagesListItem({
	images,
}: ProxiedImagesListItemProps): ReactElement {
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
				<ListItemText>Proxying {images.length} images</ListItemText>
			</ListItemButton>
			<Collapse in={showProxiedImages}>
				<Box bgcolor={theme.palette.background.default}>
					<List>
						{images.map(image => (
							<ListItemButton
								href={image.serverUrl}
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
															return "Stored on Server."
														} else {
															return "Proxying through Server."
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
