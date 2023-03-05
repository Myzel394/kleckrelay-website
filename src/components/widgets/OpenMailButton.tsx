import {IoMdMailOpen} from "react-icons/io"
import {useTranslation} from "react-i18next"
import React, {ReactElement} from "react"
import UAParser from "ua-parser-js"

import {Button} from "@mui/material"

import {APP_LINK_MAP} from "~/utils"

export interface OpenMailButtonProps {
	domain: string
}

export default function OpenMailButton({domain}: OpenMailButtonProps): ReactElement {
	const {t} = useTranslation("components")

	const userAgent = new UAParser()

	if (userAgent.getOS().name === "Android" && APP_LINK_MAP[domain]) {
		return (
			<Button startIcon={<IoMdMailOpen />} variant="text" href={APP_LINK_MAP[domain].android}>
				{t("OpenMailButton.label")}
			</Button>
		)
	}

	return <></>
}
