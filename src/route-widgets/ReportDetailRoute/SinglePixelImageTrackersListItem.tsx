import {ReactElement, useState} from "react"

import {
	Box,
	Collapse,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Typography,
	useTheme,
} from "@mui/material"

import {DecryptedReportContent} from "~/server-types"
import {BsShieldShaded} from "react-icons/bs"

export interface SinglePixelImageTrackersListItemProps {
	images: DecryptedReportContent["messageDetails"]["content"]["singlePixelImages"]
}

export default function SinglePixelImageTrackersListItem({
	images,
}: SinglePixelImageTrackersListItemProps): ReactElement {
	const theme = useTheme()

	const [showImageTrackers, setShowImageTrackers] = useState<boolean>(false)

	const imagesPerTracker = images.reduce((acc, value) => {
		acc[value.trackerName] = [...(acc[value.trackerName] || []), value]

		return acc
	}, {} as Record<string, Array<DecryptedReportContent["messageDetails"]["content"]["singlePixelImages"][0]>>)

	return (
		<>
			<ListItemButton
				onClick={() => {
					if (images.length > 0) {
						setShowImageTrackers(value => !value)
					}
				}}
			>
				<ListItemIcon>
					<BsShieldShaded />
				</ListItemIcon>
				<ListItemText>
					Removed {images.length} image trackers
				</ListItemText>
			</ListItemButton>
			<Collapse in={showImageTrackers}>
				<Box bgcolor={theme.palette.background.default}>
					<List>
						{Object.entries(imagesPerTracker).map(
							([trackerName, images]) => (
								<>
									<Typography
										variant="caption"
										component="h3"
										ml={1}
									>
										{trackerName}
									</Typography>
									{images.map(image => (
										<ListItem key={image.source}>
											{image.source}
										</ListItem>
									))}
								</>
							),
						)}
					</List>
				</Box>
			</Collapse>
		</>
	)
}
