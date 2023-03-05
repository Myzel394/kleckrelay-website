import {BsImage} from "react-icons/bs"
import {ReactElement} from "react"
import {MdLocationOn} from "react-icons/md"
import {useLoaderData} from "react-router-dom"
import {useTranslation} from "react-i18next"
import addHours from "date-fns/addHours"
import isBefore from "date-fns/isBefore"

import {Grid, List, ListItemButton, ListItemText} from "@mui/material"

import {DecryptedReportContent, ServerSettings} from "~/server-types"
import {isDev} from "~/constants/development"
import {ExpandableListItem, ExternalLinkIndication} from "~/components"

export interface ProxiedImagesListItemProps {
	images: DecryptedReportContent["messageDetails"]["content"]["proxiedImages"]
}

export default function ProxiedImagesListItem({images}: ProxiedImagesListItemProps): ReactElement {
	const {t} = useTranslation("reports")
	const serverSettings = useLoaderData() as ServerSettings

	return (
		<ExpandableListItem
			data={images}
			icon={<BsImage />}
			title={t("sections.trackers.results.proxiedImages.text", {
				count: images.length,
			})}
		>
			<List>
				{images.map(image => (
					<ListItemButton
						href={isDev ? image.url : image.serverUrl}
						target="_blank"
						key={image.imageProxyId}
					>
						<ListItemText
							primary={<ExternalLinkIndication>{image.url}</ExternalLinkIndication>}
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
														"sections.trackers.results.proxiedImages.status.isStored",
													)
												} else {
													return t(
														"sections.trackers.results.proxiedImages.status.isProxying",
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
		</ExpandableListItem>
	)
}
