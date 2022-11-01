import {IoMdMailOpen} from "react-icons/io"
import React, {ReactElement} from "react"
import UAParser from "ua-parser-js"

import {Button} from "@mui/material"

import {APP_LINK_MAP} from "~/utils"
import {useTranslation} from "react-i18next"

export interface OpenMailButtonProps {
	domain: string
}

export default function OpenMailButton({domain}: OpenMailButtonProps): ReactElement {
	const {t} = useTranslation()

	const userAgent = new UAParser()

	if (userAgent.getOS().name === "Android" && APP_LINK_MAP[domain]) {
		return (
			<Button startIcon={<IoMdMailOpen />} variant="text" href={APP_LINK_MAP[domain].android}>
				{t("components.OpenMailButton.label")}
			</Button>
		)
	}

	return <></>
}
