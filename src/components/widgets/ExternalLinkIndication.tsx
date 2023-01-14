import {ReactElement} from "react"
import {HiOutlineExternalLink} from "react-icons/hi"

import {Box, BoxProps} from "@mui/material"

export interface ExternalLinkIndicationProps extends BoxProps {}

export default function ExternalLinkIndication({
	children,
	...props
}: ExternalLinkIndicationProps): ReactElement {
	return (
		<Box component="span" {...props} display="flex" alignItems="center">
			<Box component="span" mr={1}>
				{children}
			</Box>
			<HiOutlineExternalLink />
		</Box>
	)
}
