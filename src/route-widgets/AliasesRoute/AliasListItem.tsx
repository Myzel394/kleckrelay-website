import {ReactElement} from "react"
import {FaHashtag, FaRandom} from "react-icons/fa"

import {ListItemButton, ListItemIcon, ListItemText} from "@mui/material"

import {AliasList, AliasType} from "~/server-types"

export interface AliasListItemProps {
	alias: AliasList
}

const ALIAS_TYPE_ICON_MAP: Record<AliasType, ReactElement> = {
	[AliasType.RANDOM]: <FaRandom />,
	[AliasType.CUSTOM]: <FaHashtag />,
}

export default function AliasListItem({
	alias,
}: AliasListItemProps): ReactElement {
	const address = `${alias.local}@${alias.domain}`

	return (
		<ListItemButton href={`/aliases/${btoa(address)}`}>
			<ListItemIcon>{ALIAS_TYPE_ICON_MAP[alias.type]}</ListItemIcon>
			<ListItemText primary={address} />
		</ListItemButton>
	)
}
