import {ReactElement} from "react"
import {MdOutlineMoreVert} from "react-icons/md"

import {
	IconButton,
	ListItem,
	ListItemSecondaryAction,
	ListItemText,
} from "@mui/material"

import {Alias} from "~/server-types"

export interface AliasListItemProps {
	alias: Alias
}

export default function AliasListItem({
	alias,
}: AliasListItemProps): ReactElement {
	return (
		<ListItem>
			<ListItemText primary={`${alias.local}@${alias.domain}`} />
			<ListItemSecondaryAction>
				<IconButton edge="end">
					<MdOutlineMoreVert />
				</IconButton>
			</ListItemSecondaryAction>
		</ListItem>
	)
}
