import {ReactElement} from "react"
import {MdOutlineMoreVert} from "react-icons/md"

import {
	IconButton,
	ListItemButton,
	ListItemSecondaryAction,
	ListItemText,
} from "@mui/material"

import {AliasList} from "~/server-types"

export interface AliasListItemProps {
	alias: AliasList
}

export default function AliasListItem({
	alias,
}: AliasListItemProps): ReactElement {
	const address = `${alias.local}@${alias.domain}`

	return (
		<ListItemButton href={`/aliases/${btoa(address)}`}>
			<ListItemText primary={address} />
			<ListItemSecondaryAction>
				<IconButton edge="end">
					<MdOutlineMoreVert />
				</IconButton>
			</ListItemSecondaryAction>
		</ListItemButton>
	)
}
