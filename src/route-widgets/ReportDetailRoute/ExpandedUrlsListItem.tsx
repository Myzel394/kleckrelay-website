import {ReactElement} from "react"
import {useTranslation} from "react-i18next"
import {BsArrowsAngleExpand} from "react-icons/bs"

import {List, ListItemButton, ListItemText} from "@mui/material"

import {DecryptedReportContent} from "~/server-types"
import {ExpandableListItem, ExternalLinkIndication} from "~/components"

export interface ExpandedUrlsListItemProps {
	urls: DecryptedReportContent["messageDetails"]["content"]["expandedUrls"]
}

export default function ExpandedUrlsListItem({urls}: ExpandedUrlsListItemProps): ReactElement {
	const {t} = useTranslation("reports")

	return (
		<ExpandableListItem
			data={urls}
			icon={<BsArrowsAngleExpand />}
			title={t("sections.trackers.results.expandedUrls.text", {
				count: urls.length,
			})}
		>
			<List>
				{urls.map(urlData => (
					<ListItemButton
						key={urlData.originalUrl}
						component="a"
						href={urlData.expandedUrl}
						target="_blank"
						rel="noopener noreferrer nofollow"
					>
						<ListItemText
							primary={
								<ExternalLinkIndication>
									{urlData.expandedUrl}
								</ExternalLinkIndication>
							}
							secondary={urlData.originalUrl}
						/>
					</ListItemButton>
				))}
			</List>
		</ExpandableListItem>
	)
}
