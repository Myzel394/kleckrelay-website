import {ReactElement, ReactNode, useState} from "react"

import {Box, Collapse, ListItemButton, ListItemIcon, ListItemText, useTheme} from "@mui/material"

export interface ExpandedUrlsListItemProps<T> {
	data: T[]
	icon: ReactElement
	title: string
	children: ReactNode
}

export default function ExpandedUrlsListItem<T>({
	data,
	children,
	icon,
	title,
}: ExpandedUrlsListItemProps<T>): ReactElement {
	const [isExpanded, setIsExpanded] = useState<boolean>(false)
	const theme = useTheme()

	return (
		<>
			<ListItemButton
				onClick={() => {
					if (data.length > 0) {
						setIsExpanded(value => !value)
					}
				}}
			>
				<ListItemIcon>{icon}</ListItemIcon>
				<ListItemText>{title}</ListItemText>
			</ListItemButton>
			<Collapse in={isExpanded}>
				<Box bgcolor={theme.palette.background.default}>{children}</Box>
			</Collapse>
		</>
	)
}
