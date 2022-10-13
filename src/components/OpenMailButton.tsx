import {ReactElement} from "react"
import UAParser from "ua-parser-js"
import {Button} from "@mui/material"
import {APP_LINK_MAP} from "utils"
import {IoMdMailOpen} from "react-icons/io"

export interface OpenMailButtonProps {
	domain: string
}

export default function OpenMailButton({
	domain,
}: OpenMailButtonProps): ReactElement {
	const userAgent = new UAParser()

	if (userAgent.getOS().name === "Android" && APP_LINK_MAP[domain]) {
		return (
			<Button
				startIcon={<IoMdMailOpen />}
				variant="contained"
				href={APP_LINK_MAP[domain].android}
			>
				Open Mail
			</Button>
		)
	}

	return <></>
}
