import {ReactElement} from "react"
import {BsShieldShaded} from "react-icons/bs"
import {useTranslation} from "react-i18next"

import {List, ListItem, Typography} from "@mui/material"

import {DecryptedReportContent} from "~/server-types"
import {ExpandableListItem} from "~/components"

export interface SinglePixelImageTrackersListItemProps {
	images: DecryptedReportContent["messageDetails"]["content"]["singlePixelImages"]
}

export default function SinglePixelImageTrackersListItem({
	images,
}: SinglePixelImageTrackersListItemProps): ReactElement {
	const {t} = useTranslation()

	const imagesPerTracker = images.reduce((acc, value) => {
		acc[value.trackerName] = [...(acc[value.trackerName] || []), value]

		return acc
	}, {} as Record<string, Array<DecryptedReportContent["messageDetails"]["content"]["singlePixelImages"][0]>>)

	return (
		<ExpandableListItem
			data={images}
			icon={<BsShieldShaded />}
			title={t("routes.ReportDetailRoute.sections.trackers.results.imageTrackers.text", {
				count: images.length,
			})}
		>
			<List>
				{Object.entries(imagesPerTracker).map(([trackerName, images]) => (
					<>
						<Typography variant="caption" component="h3" ml={1}>
							{trackerName}
						</Typography>
						{images.map(image => (
							<ListItem key={image.source}>{image.source}</ListItem>
						))}
					</>
				))}
			</List>
		</ExpandableListItem>
	)
}
