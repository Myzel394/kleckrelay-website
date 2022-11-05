import {ReactElement, useContext} from "react"
import {BiStats} from "react-icons/bi"
import {MdSettings} from "react-icons/md"
import {FaMask} from "react-icons/fa"
import {Link as RouterLink, useLocation} from "react-router-dom"
import {useTranslation} from "react-i18next"

import {Button} from "@mui/material"
import {mdiTextBoxMultiple} from "@mdi/js/commonjs/mdi"
import Icon from "@mdi/react"

import LockNavigationContext from "~/LockNavigationContext/LockNavigationContext"

export enum NavigationSection {
	Overview,
	Aliases,
	Reports,
	Settings,
}

export interface NavigationButtonProps {
	section: NavigationSection
}

const SECTION_ICON_MAP: Record<NavigationSection, ReactElement> = {
	[NavigationSection.Overview]: <BiStats />,
	[NavigationSection.Aliases]: <FaMask />,
	[NavigationSection.Reports]: <Icon path={mdiTextBoxMultiple} size={0.8} />,
	[NavigationSection.Settings]: <MdSettings />,
}

const SECTION_TEXT_MAP: Record<NavigationSection, string> = {
	[NavigationSection.Overview]: "components.NavigationButton.overview",
	[NavigationSection.Aliases]: "components.NavigationButton.aliases",
	[NavigationSection.Reports]: "components.NavigationButton.reports",
	[NavigationSection.Settings]: "components.NavigationButton.settings",
}

const PATH_SECTION_MAP: Record<string, NavigationSection> = {
	"": NavigationSection.Overview,
	aliases: NavigationSection.Aliases,
	reports: NavigationSection.Reports,
	settings: NavigationSection.Settings,
}

export default function NavigationButton({section}: NavigationButtonProps): ReactElement {
	const {t} = useTranslation()
	const {handleAnchorClick} = useContext(LockNavigationContext)
	const location = useLocation()

	const currentSection = PATH_SECTION_MAP[location.pathname.split("/")[1]]
	const Icon = SECTION_ICON_MAP[section]
	const text = t(SECTION_TEXT_MAP[section])

	return (
		<Button
			fullWidth
			color="inherit"
			variant={section === currentSection ? "outlined" : "text"}
			startIcon={Icon}
			component={RouterLink}
			to={
				Object.keys(PATH_SECTION_MAP).find(path => PATH_SECTION_MAP[path] === section) ??
				"/"
			}
			onClick={handleAnchorClick}
		>
			{text}
		</Button>
	)
}
