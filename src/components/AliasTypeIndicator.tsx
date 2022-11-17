import {ReactElement} from "react"
import {FaHashtag, FaRandom} from "react-icons/fa"
import {useTranslation} from "react-i18next"

import {Box, Tooltip} from "@mui/material"

import {AliasType} from "~/server-types"
import {createEnumMapFromTranslation} from "~/utils"

export interface AliasTypeIndicatorProps {
	type: AliasType
}

export const ALIAS_TYPE_ICON_MAP: Record<AliasType, ReactElement> = {
	[AliasType.RANDOM]: <FaRandom />,
	[AliasType.CUSTOM]: <FaHashtag />,
}

const ALIAS_TYPE_TOOLTIP_MAP = createEnumMapFromTranslation(
	"components.AliasTypeIndicator",
	AliasType,
)

export default function AliasTypeIndicator({type}: AliasTypeIndicatorProps): ReactElement {
	const {t} = useTranslation()

	return (
		<Tooltip title={t(ALIAS_TYPE_TOOLTIP_MAP[type] as string)} arrow>
			<Box display="flex" justifyContent="center" alignItems="center">
				{ALIAS_TYPE_ICON_MAP[type]}
			</Box>
		</Tooltip>
	)
}
