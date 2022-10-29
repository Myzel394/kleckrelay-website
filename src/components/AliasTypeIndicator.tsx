import {ReactElement} from "react"
import {FaHashtag, FaRandom} from "react-icons/fa"

import {Box, Tooltip} from "@mui/material"

import {AliasType} from "~/server-types"

export interface AliasTypeIndicatorProps {
	type: AliasType
}

const ALIAS_TYPE_ICON_MAP: Record<AliasType, ReactElement> = {
	[AliasType.RANDOM]: <FaRandom />,
	[AliasType.CUSTOM]: <FaHashtag />,
}

const ALIAS_TYPE_TOOLTIP_MAP: Record<AliasType, string> = {
	[AliasType.RANDOM]: "This is a randomly generated alias",
	[AliasType.CUSTOM]: "This is a custom-made alias",
}

export default function AliasTypeIndicator({
	type,
}: AliasTypeIndicatorProps): ReactElement {
	return (
		<Tooltip title={ALIAS_TYPE_TOOLTIP_MAP[type]} arrow>
			<Box display="flex" justifyContent="center" alignItems="center">
				{ALIAS_TYPE_ICON_MAP[type]}
			</Box>
		</Tooltip>
	)
}
